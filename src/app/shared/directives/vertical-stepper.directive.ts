import { AfterViewInit, Directive, ElementRef, Input, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appVerticalStepper]'
})
export class VerticalStepperDirective implements AfterViewInit, OnDestroy {
  @Input() startStep: number = 0;
  // Optional custom colors provided on the host element
  @Input() verticalLineNeonColor?: string; // neon color for the progress line
  @Input() stepColor?: string; // active step (non-final) color
  @Input() finalStepColor?: string; // active color for the last step
  @Input() separateLeft?: number; // horizontal separation from the host's left edge

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {}

  private overlay!: HTMLElement;
  private railLine!: HTMLElement; // static full rail (light)
  private progressLine!: HTMLElement; // growing neon line
  private dots: HTMLElement[] = [];
  private stepElements: HTMLElement[] = [];
  private stepPositions: number[] = []; // relative to host
  private host!: HTMLElement;
  private minY = 0;
  private maxY = 0;
  private readonly gutter = 60; // px (default separation when separateLeft is not provided)
  private readonly neon = '#00e5ff';
  private readonly neonYellow = '#ffea00';
  private readonly neonGreen = '#69f0ae';
  private io?: IntersectionObserver;
  private resizeObs?: ResizeObserver;
  private clipResizeObs?: ResizeObserver;
  private scrollHandler?: () => void;
  private transitionEndHandler?: (e: TransitionEvent) => void;
  private stepCount = 0;
  private offsetLeft = 60;
  private mo?: MutationObserver;
  private overlayVisible = false;
  private visibilityDebounce?: number;
  private isInitialized = false;
  private initialStepSelectors: string[] = []; // Store selectors to track original steps

  // Helper: cumulative offsetTop relative to host
  private getOffsetTopTo(el: HTMLElement, ancestor: HTMLElement): number {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node && node !== ancestor) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return y;
  }

  // Helper: determine if an element exists and is connected to DOM
  private isElementConnected(el: HTMLElement): boolean {
    if (!el?.isConnected) return false;
    const cs = window.getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden';
  }

  // Helper: create a unique selector for an element to track it across DOM changes
  private createElementSelector(el: HTMLElement): string {
    const tagName = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
    const stepAttr = el.getAttribute('step') ? `[step="${el.getAttribute('step')}"]` : '[step]';

    // Create a selector that's specific enough to identify this element
    let selector = tagName + id + classes + stepAttr;

    // If still not unique enough, add position-based selector
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(child =>
        child.tagName === el.tagName && child.hasAttribute('step')
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(el);
        selector += `:nth-of-type(${index + 1})`;
      }
    }

    return selector;
  }

  // Helper: check if original steps are still present in DOM after initialization
  private areInitialStepsPresent(): boolean {
    if (!this.isInitialized || this.initialStepSelectors.length === 0) {
      return true; // During initialization, don't be restrictive
    }

    // Simplified check: just verify if any step elements exist
    // This is less aggressive than checking specific selectors
    const currentSteps = this.host.querySelectorAll('[step]');
    return currentSteps.length > 0;
  }

  // Helper: detect if any clipping ancestor (overflow != visible) currently clips its content
  private isContentClipped(): boolean {
    if (!this.stepElements.length) return false;

    // First check if we're inside a collapsed blog content wrapper
    if (this.isInsideCollapsedBlogWrapper()) {
      return true;
    }

    // Check ancestors of the first step (sufficient, as collapsing wraps the whole group)
    let node: HTMLElement | null = this.stepElements[0].parentElement;
    while (node && node !== this.host.parentElement) {
      const cs = window.getComputedStyle(node);
      const clips = (val: string) => val !== 'visible';
      if (clips(cs.overflow) || clips(cs.overflowX) || clips(cs.overflowY)) {
        const client = node.clientHeight;
        const scroll = node.scrollHeight;
        if (scroll > client + 1) return true; // content is being clipped
      }
      node = node.parentElement;
    }
    return false;
  }

  // Helper: check if the stepper is inside a collapsed blog content wrapper
  private isInsideCollapsedBlogWrapper(): boolean {
    let node: HTMLElement | null = this.host;
    while (node) {
      if (node.hasAttribute('data-content-collapsed') && node.getAttribute('data-content-collapsed') === 'true') {
        console.log('🚫 Found collapsed blog wrapper, hiding stepper');
        return true;
      }
      node = node.parentElement;
    }
    return false;
  }

  // Helper: determine if an element is actually visible considering ancestor clipping
  private isElementActuallyVisible(el: HTMLElement): boolean {
    if (!el.isConnected) return false;
    let rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;

    const selfCs = window.getComputedStyle(el);
    if (selfCs.display === 'none' || selfCs.visibility === 'hidden') return false;

    // Walk up ancestors and intersect rects when ancestor clips overflow
    let left = rect.left;
    let top = rect.top;
    let right = rect.right;
    let bottom = rect.bottom;

    let node: HTMLElement | null = el.parentElement;
    while (node) {
      const cs = window.getComputedStyle(node);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const overflowX = cs.overflowX;
      const overflowY = cs.overflowY;
      const overflow = cs.overflow;
      const clips = (val: string) => val !== 'visible';
      if (clips(overflow) || clips(overflowX) || clips(overflowY)) {
        const aRect = node.getBoundingClientRect();
        left = Math.max(left, aRect.left);
        top = Math.max(top, aRect.top);
        right = Math.min(right, aRect.right);
        bottom = Math.min(bottom, aRect.bottom);
        if (right <= left || bottom <= top) return false; // fully clipped out
      }
      node = node.parentElement;
    }
    return true;
  }

  // Observe clipping ancestors so we react to collapse/expand size changes
  private observeClippingAncestors() {
    if (typeof ResizeObserver === 'undefined') return;
    this.clipResizeObs ??= new ResizeObserver(() => {
      this.evaluateVisibility();
    });
    try { this.clipResizeObs.disconnect(); } catch {}

    const toObserve = new Set<HTMLElement>();
    for (const step of this.stepElements) {
      let node: HTMLElement | null = step.parentElement;
      while (node && node !== this.host.parentElement) {
        const cs = window.getComputedStyle(node);
        const clips = (val: string) => val !== 'visible';
        if (clips(cs.overflow) || clips(cs.overflowX) || clips(cs.overflowY)) {
          toObserve.add(node);
        }
        node = node.parentElement;
      }
    }
    toObserve.forEach((el) => this.clipResizeObs!.observe(el));
  }

  // Build a generic neon glow using the provided color string
  private glow(color: string): string {
    return `0 0 6px ${color}, 0 0 14px ${color}, 0 0 22px ${color}`;
  }

  ngAfterViewInit() {
    // Ensure layout is settled before measuring positions
    requestAnimationFrame(() => {
      const host: HTMLElement = (this.host = this.el.nativeElement as HTMLElement);
      const stepNodeList = host.querySelectorAll<HTMLElement>('[step]');
      const stepCount = (this.stepCount = stepNodeList.length);

      // Overlay must superimpose above content without changing layout
      this.renderer.setStyle(host, 'position', 'relative');

      const overlay = this.renderer.createElement('div') as HTMLElement;
      this.overlay = overlay;
      this.renderer.setStyle(overlay, 'position', 'absolute');
      // Compute and store the left offset (how much to shift left from host's left edge)
      this.offsetLeft = Number.isFinite(Number(this.separateLeft)) ? Math.max(0, Number(this.separateLeft)) : this.gutter;
      // Ensure the overlay is wide enough to contain the rail and dots; overflow is visible anyway
      this.renderer.setStyle(overlay, 'width', `${this.offsetLeft + 60}px`);
      this.renderer.setStyle(overlay, 'pointer-events', 'none');
      this.renderer.setStyle(overlay, 'z-index', '9999');
      this.renderer.setStyle(overlay, 'overflow', 'visible');
      // Append to document body to avoid clipping by ancestor overflow/stacking contexts
      const doc = this.host.ownerDocument || document;
      this.renderer.appendChild(doc.body, overlay);
      // Position overlay relative to the page
      this.updateOverlayPosition();

      if (stepCount) {
        this.stepElements = Array.from(stepNodeList);
        // Store selectors for initial steps to track them later
        this.initialStepSelectors = this.stepElements.map(el => this.createElementSelector(el));
        this.stepPositions = this.stepElements.map((el) => this.getOffsetTopTo(el, host));
        this.minY = Math.min(...this.stepPositions);
        this.maxY = Math.max(...this.stepPositions);

        // Draw the vertical rail spanning from the first to the last step
        const lineLeft = 0; // inside the overlay, 0 aligns to host left minus offset
        const fullRail = this.renderer.createElement('div') as HTMLElement;
        this.railLine = fullRail;
        this.renderer.setStyle(fullRail, 'position', 'absolute');
        this.renderer.setStyle(fullRail, 'left', `${lineLeft}px`);
        this.renderer.setStyle(fullRail, 'top', `${this.startStep + this.minY}px`);
        const fullRailHeight = Math.max(0, this.maxY - this.minY) || 1;
        this.renderer.setStyle(fullRail, 'height', `${fullRailHeight}px`);
        this.renderer.setStyle(fullRail, 'width', '3px');
        // Subtle base color
        this.renderer.setStyle(fullRail, 'background-color', '#b0bec519');
        this.renderer.setStyle(fullRail, 'border-radius', '2px');
        this.renderer.appendChild(overlay, fullRail);

        // Progress neon line (starts at 0 height)
        const progress = this.renderer.createElement('div') as HTMLElement;
        this.progressLine = progress;
        this.renderer.setStyle(progress, 'position', 'absolute');
        this.renderer.setStyle(progress, 'left', `${lineLeft}px`);
        this.renderer.setStyle(progress, 'top', `${this.startStep + this.minY}px`);
        this.renderer.setStyle(progress, 'width', '3px');
        this.renderer.setStyle(progress, 'height', '0px');
        const lineColor = this.verticalLineNeonColor?.toString().trim() || this.neon;
        this.renderer.setStyle(progress, 'background-color', lineColor);
        this.renderer.setStyle(progress, 'box-shadow', this.glow(lineColor));
        this.renderer.setStyle(progress, 'border-radius', '2px');
        this.renderer.appendChild(overlay, progress);

        // Draw each step point exactly at the step element position
        const dotSize = 20; // px
        const dotRadius = dotSize / 2;
        const inactiveBg = '#eceff1';
        const inactiveBorder = '#90a4ae';

        this.stepElements.forEach((_, index) => {
          const y = this.stepPositions[index];
          const stepPoint = this.renderer.createElement('div') as HTMLElement;
          this.renderer.setStyle(stepPoint, 'position', 'absolute');
          // Center the dot on the rail
          this.renderer.setStyle(stepPoint, 'left', `${lineLeft - dotRadius}px`);
          // Center the dot vertically on the intersection with the step element
          this.renderer.setStyle(stepPoint, 'top', `${this.startStep + y - dotRadius}px`);
          this.renderer.setStyle(stepPoint, 'width', `${dotSize}px`);
          this.renderer.setStyle(stepPoint, 'height', `${dotSize}px`);
          this.renderer.setStyle(stepPoint, 'border-radius', '50%');
          this.renderer.setStyle(stepPoint, 'background-color', inactiveBg);
          this.renderer.setStyle(stepPoint, 'border', `2px solid ${inactiveBorder}`);
          this.renderer.setStyle(stepPoint, 'display', 'flex');
          this.renderer.setStyle(stepPoint, 'align-items', 'center');
          this.renderer.setStyle(stepPoint, 'justify-content', 'center');
          this.renderer.setStyle(stepPoint, 'color', '#263238');
          this.renderer.setStyle(stepPoint, 'font-weight', '700');
          this.renderer.setStyle(stepPoint, 'font-size', '10px');
          this.renderer.setStyle(stepPoint, 'line-height', `${dotSize}px`);
          this.renderer.setStyle(stepPoint, 'box-shadow', 'none');
          // scale-out initial state and smooth transition
          this.renderer.setStyle(stepPoint, 'transform', 'scale(0.7)');
          this.renderer.setStyle(stepPoint, 'transition', 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)');
          this.renderer.setStyle(stepPoint, 'transform-origin', 'center center');
          // No text initially; will appear when neon progress reaches this dot
          this.renderer.setProperty(stepPoint, 'innerText', '');
          this.renderer.appendChild(overlay, stepPoint);
          this.dots.push(stepPoint);
        });
      }

      // Setup observers and handlers first
      this.setupObservers();
      this.setupMutationObserver();

      // Ensure stepper shows immediately if steps are found
      // Use setTimeout to allow any pending DOM updates to complete
      setTimeout(() => {
        this.evaluateVisibility();
        // Force a second evaluation after a brief delay to catch any late DOM changes
        setTimeout(() => {
          this.evaluateVisibility();
          // Mark as initialized after the initial evaluations
          this.isInitialized = true;
        }, 100);
      }, 0);
    });
  }

  private setupMutationObserver() {
    if (this.mo) this.mo.disconnect();
    this.mo = new MutationObserver((mutations) => {
      let shouldRecheck = false;

      for (const mutation of mutations) {
        if (this.shouldRecheckForMutation(mutation)) {
          shouldRecheck = true;
          break;
        }
      }

      if (shouldRecheck) {
        this.debouncedEvaluateVisibility();
      }
    });

    // Observe the host element
    this.mo.observe(this.host, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['step', 'class', 'style', 'hidden', 'data-content-collapsed']
    });

    // Also observe ancestors for blog wrapper state changes
    this.observeBlogWrapperAncestors();
  }

  private observeBlogWrapperAncestors() {
    let node: HTMLElement | null = this.host.parentElement;
    while (node && node !== document.body) {
      // If we find a content-inner element, observe it for attribute changes
      if (node.classList.contains('content-inner')) {
        this.mo?.observe(node, {
          attributes: true,
          attributeFilter: ['data-content-collapsed', 'class']
        });
        console.log('👀 Observing blog wrapper ancestor for collapse/expand');
        break;
      }
      node = node.parentElement;
    }
  }

  private shouldRecheckForMutation(mutation: MutationRecord): boolean {
    if (mutation.type === 'childList') {
      return this.hasStepElementChanges(mutation);
    }

    if (mutation.type === 'attributes') {
      const attrName = mutation.attributeName;
      return attrName === 'step' || attrName === 'class' || attrName === 'style' || attrName === 'data-content-collapsed';
    }

    return false;
  }

  private hasStepElementChanges(mutation: MutationRecord): boolean {
    const nodesToCheck = [...mutation.addedNodes, ...mutation.removedNodes];

    for (const node of nodesToCheck) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.hasAttribute('step') || element.querySelector('[step]')) {
          // Special handling for removed step elements when initialized
          if (this.isInitialized && mutation.removedNodes.length > 0) {
            this.handleStepRemoval();
          }
          return true;
        }
      }
    }

    return false;
  }

  private handleStepRemoval(): void {
    if (!this.areInitialStepsPresent()) {
      this.setOverlayVisible(false);
    }
  }

  private debouncedEvaluateVisibility(): void {
    if (this.visibilityDebounce) clearTimeout(this.visibilityDebounce);
    this.visibilityDebounce = (setTimeout(() => {
      this.evaluateVisibility();
    }, 50) as unknown) as number;
  }

  private setOverlayVisible(visible: boolean) {
    this.overlayVisible = visible;
    if (!this.overlay) return;
    this.renderer.setStyle(this.overlay, 'display', visible ? 'block' : 'none');
  }

  private evaluateVisibility() {
    const allNodes = Array.from(this.host.querySelectorAll<HTMLElement>('[step]'));

    // Hide if no steps found at all
    if (allNodes.length === 0) {
      this.setOverlayVisible(false);
      return;
    }

    // Simplified logic: just check if we have steps that are connected to DOM
    const connectedSteps = allNodes.filter(el => this.isElementConnected(el));

    if (connectedSteps.length > 0) {
      this.stepElements = connectedSteps;

      // Only hide if content is actively clipped AND no steps are actually visible
      // This handles the collapse/expand functionality from BlogContentWrapper
      const isClipped = this.isContentClipped();
      const hasVisibleSteps = this.stepElements.some(el => this.isElementActuallyVisible(el));

      if (isClipped && !hasVisibleSteps) {
        this.setOverlayVisible(false);
        return;
      }

      // Show the stepper
      this.setOverlayVisible(true);
      this.rebuildGraphics(false);
      this.observeClippingAncestors();
    } else {
      this.setOverlayVisible(false);
    }
  }

  // Rebuild dots and update layout/observers when stepElements set changes or visibility toggles
  private rebuildGraphics(force: boolean) {
    const needRebuild = force || this.dots.length !== this.stepElements.length || this.stepCount !== this.stepElements.length;
    if (!this.overlay) return;

    // Ensure base rail/progress lines exist
    if (!this.railLine) {
      const fullRail = this.renderer.createElement('div') as HTMLElement;
      this.railLine = fullRail;
      this.renderer.setStyle(fullRail, 'position', 'absolute');
      this.renderer.setStyle(fullRail, 'left', `0px`);
      this.renderer.setStyle(fullRail, 'top', `0px`);
      this.renderer.setStyle(fullRail, 'height', `0px`);
      this.renderer.setStyle(fullRail, 'width', '3px');
      this.renderer.setStyle(fullRail, 'background-color', '#b0bec519');
      this.renderer.setStyle(fullRail, 'border-radius', '2px');
      this.renderer.appendChild(this.overlay, fullRail);
    }
    if (!this.progressLine) {
      const progress = this.renderer.createElement('div') as HTMLElement;
      this.progressLine = progress;
      this.renderer.setStyle(progress, 'position', 'absolute');
      this.renderer.setStyle(progress, 'left', `0px`);
      this.renderer.setStyle(progress, 'top', `0px`);
      this.renderer.setStyle(progress, 'width', '3px');
      this.renderer.setStyle(progress, 'height', '0px');
      const lineColor = this.verticalLineNeonColor?.toString().trim() || this.neon;
      this.renderer.setStyle(progress, 'background-color', lineColor);
      this.renderer.setStyle(progress, 'box-shadow', this.glow(lineColor));
      this.renderer.setStyle(progress, 'border-radius', '2px');
      this.renderer.appendChild(this.overlay, progress);
    }

    // Recompute positions and rails
    const host = this.host;
    this.stepPositions = this.stepElements.map((el) => this.getOffsetTopTo(el, host));
    this.minY = Math.min(...this.stepPositions);
    this.maxY = Math.max(...this.stepPositions);

    const fullRailTop = this.startStep + this.minY;
    const fullRailHeight = Math.max(0, this.maxY - this.minY) || 1;
    this.renderer.setStyle(this.railLine, 'top', `${fullRailTop}px`);
    this.renderer.setStyle(this.railLine, 'height', `${fullRailHeight}px`);
    this.renderer.setStyle(this.progressLine, 'top', `${fullRailTop}px`);

    if (needRebuild) {
      // Remove old dots
      for (const dot of this.dots) {
        try {
          this.overlay.removeChild(dot);
        } catch {}
      }
      this.dots = [];
      this.stepCount = this.stepElements.length;

      // Create new dots
      const dotSize = 20;
      const dotRadius = dotSize / 2;
      const inactiveBg = '#eceff1';
      const inactiveBorder = '#90a4ae';
      const lineLeft = 0;
      this.stepElements.forEach((_, index) => {
        const y = this.stepPositions[index];
        const stepPoint = this.renderer.createElement('div') as HTMLElement;
        this.renderer.setStyle(stepPoint, 'position', 'absolute');
        this.renderer.setStyle(stepPoint, 'left', `${lineLeft - dotRadius}px`);
        this.renderer.setStyle(stepPoint, 'top', `${this.startStep + y - dotRadius}px`);
        this.renderer.setStyle(stepPoint, 'width', `${dotSize}px`);
        this.renderer.setStyle(stepPoint, 'height', `${dotSize}px`);
        this.renderer.setStyle(stepPoint, 'border-radius', '50%');
        this.renderer.setStyle(stepPoint, 'background-color', inactiveBg);
        this.renderer.setStyle(stepPoint, 'border', `2px solid ${inactiveBorder}`);
        this.renderer.setStyle(stepPoint, 'display', 'flex');
        this.renderer.setStyle(stepPoint, 'align-items', 'center');
        this.renderer.setStyle(stepPoint, 'justify-content', 'center');
        this.renderer.setStyle(stepPoint, 'color', '#263238');
        this.renderer.setStyle(stepPoint, 'font-weight', '700');
        this.renderer.setStyle(stepPoint, 'font-size', '10px');
        this.renderer.setStyle(stepPoint, 'line-height', `${dotSize}px`);
        this.renderer.setStyle(stepPoint, 'box-shadow', 'none');
        this.renderer.setStyle(stepPoint, 'transform', 'scale(0.7)');
        this.renderer.setStyle(stepPoint, 'transition', 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)');
        this.renderer.setStyle(stepPoint, 'transform-origin', 'center center');
        this.renderer.setProperty(stepPoint, 'innerText', '');
        this.renderer.appendChild(this.overlay, stepPoint);
        this.dots.push(stepPoint);
      });

      // Re-setup observers for the updated step list
      this.setupObservers();
    } else {
      // Reposition existing dots
      const dotRadius = (parseFloat(this.dots[0]?.style.width || '20') || 20) / 2;
      this.dots.forEach((dot, i) => {
        const y = this.stepPositions[i];
        this.renderer.setStyle(dot, 'top', `${this.startStep + y - dotRadius}px`);
      });
    }

    // Update overlay absolute position and progress based on viewport
    this.updateOverlayPosition();
    this.updateProgressFromViewport();
  }

  private setupObservers() {
    // Intersection Observer for progress updates
    if (this.io) this.io.disconnect();
    this.io = new IntersectionObserver(() => {
      this.updateProgressFromViewport();
    }, { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0 });
    this.stepElements.forEach((el) => this.io!.observe(el));

    // Resize Observer for layout changes
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(() => {
        this.recomputeLayout();
        this.evaluateVisibility();
      });
      this.resizeObs.observe(this.host);
    }

    // Scroll handler for progress updates
    this.scrollHandler = () => {
      this.updateOverlayPosition();
      this.updateProgressFromViewport();
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    // Listen for transition end (e.g., max-height on collapsed container) to re-check visibility
    this.transitionEndHandler = () => {
      // Allow paint and then evaluate
      requestAnimationFrame(() => this.evaluateVisibility());
    };
    this.host.addEventListener('transitionend', this.transitionEndHandler);
  }

  private recomputeLayout() {
    // Recalculate step positions and adjust lines/dots
    const host = this.host;
    this.stepPositions = this.stepElements.map((el) => this.getOffsetTopTo(el, host));
    this.minY = Math.min(...this.stepPositions);
    this.maxY = Math.max(...this.stepPositions);

  // Update overlay absolute position (in case host moved/sized)
  this.updateOverlayPosition();

    const fullRailTop = this.startStep + this.minY;
    const fullRailHeight = Math.max(0, this.maxY - this.minY) || 1;
    this.renderer.setStyle(this.railLine, 'top', `${fullRailTop}px`);
    this.renderer.setStyle(this.railLine, 'height', `${fullRailHeight}px`);
    this.renderer.setStyle(this.progressLine, 'top', `${fullRailTop}px`);

    // Reposition dots
    const dotRadius = (parseFloat(this.dots[0]?.style.width || '20') || 20) / 2;
    this.dots.forEach((dot, i) => {
      const y = this.stepPositions[i];
      this.renderer.setStyle(dot, 'top', `${this.startStep + y - dotRadius}px`);
    });

    this.updateProgressFromViewport();
  }

  private updateProgressFromViewport() {
    if (!this.progressLine) return;

    // Absolute positions
    const hostRect = this.host.getBoundingClientRect();
    const hostTopAbs = hostRect.top + window.scrollY;
    const viewportBottomAbs = window.scrollY + window.innerHeight;
    const bottomGap = 100; // px separation from screen bottom

    // Base (top) of progress absolute
    const progressTopAbs = hostTopAbs + this.startStep + this.minY;
    // Max allowed bottom by viewport gap
    const allowedBottomAbs = viewportBottomAbs - bottomGap;
  // Last step absolute y (don't grow beyond last step) — include startStep to match progress coordinate system
  const lastStepAbs = hostTopAbs + this.startStep + this.maxY;
    // Desired bottom is the minimum of allowed bottom and last step
    const desiredBottomAbs = Math.min(allowedBottomAbs, lastStepAbs);
  // Height cannot be negative and cannot exceed full rail height
  const fullRailHeight = Math.max(0, this.maxY - this.minY);
  const height = Math.max(0, Math.min(fullRailHeight, desiredBottomAbs - progressTopAbs));

    this.renderer.setStyle(this.progressLine, 'height', `${height}px`);

    // Activate/deactivate dots exactly when the neon line touches them (consider dot radius)
    const progressBottomAbs = progressTopAbs + height;
    const dotBaseRadius = 10; // Fixed 20px dot size / 2
    this.dots.forEach((dot, i) => {
      const dotCenterAbs = hostTopAbs + this.startStep + this.stepPositions[i];
      const dotTopAbs = dotCenterAbs - dotBaseRadius;
      const isTouched = progressBottomAbs >= dotTopAbs;

      if (isTouched) {
        // Active: apply configured colors with neon glow and scale up
        const isLast = i === this.dots.length - 1;
        const activeColor = isLast
          ? (this.finalStepColor?.toString().trim() || this.neonGreen)
          : (this.stepColor?.toString().trim() || this.neonYellow);
        const glowEffect = this.glow(activeColor);

        this.renderer.setStyle(dot, 'background-color', activeColor);
        this.renderer.removeStyle(dot, 'border');
        this.renderer.setStyle(dot, 'color', '#111');
        this.renderer.setStyle(dot, 'box-shadow', glowEffect);
        this.renderer.setStyle(dot, 'transform', 'scale(1.2)'); // More pronounced scaling
        this.renderer.setStyle(dot, 'z-index', '10'); // Ensure it's above other elements
        this.renderer.setProperty(dot, 'innerText', `${i + 1}/${this.stepCount}`);
      } else {
        // Inactive: shrink and remove glow
        this.renderer.setStyle(dot, 'background-color', '#eceff1');
        this.renderer.setStyle(dot, 'border', '2px solid #90a4ae');
        this.renderer.setStyle(dot, 'color', '#263238');
        this.renderer.setStyle(dot, 'box-shadow', 'none');
        this.renderer.setStyle(dot, 'transform', 'scale(0.7)'); // Smaller inactive state
        this.renderer.removeStyle(dot, 'z-index');
        this.renderer.setProperty(dot, 'innerText', '');
      }
    });
  }

  private updateOverlayPosition() {
    if (!this.overlay || !this.host) return;
    const rect = this.host.getBoundingClientRect();
    const topAbs = window.scrollY + rect.top;
    const leftAbs = window.scrollX + rect.left - this.offsetLeft;
    this.renderer.setStyle(this.overlay, 'top', `${topAbs}px`);
    this.renderer.setStyle(this.overlay, 'left', `${leftAbs}px`);
  }

  ngOnDestroy(): void {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
    if (this.mo) {
      this.mo.disconnect();
      this.mo = undefined;
    }
    if (this.resizeObs) {
      this.resizeObs.disconnect();
      this.resizeObs = undefined;
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = undefined;
    }
    if (this.transitionEndHandler) {
      this.host.removeEventListener('transitionend', this.transitionEndHandler);
      this.transitionEndHandler = undefined;
    }
    if (this.clipResizeObs) {
      this.clipResizeObs.disconnect();
      this.clipResizeObs = undefined;
    }
    // Remove overlay from DOM
    this.overlay?.parentElement?.removeChild(this.overlay);
  }
}
