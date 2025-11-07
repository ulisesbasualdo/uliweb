import { AfterViewInit, Directive, effect, ElementRef, input, OnDestroy, Renderer2 } from '@angular/core';

/**
 * Representa los elementos de un paso con su información de posicionamiento.
 * @interface StepElements
 */
interface StepElements {
  /** El elemento HTML del paso */
  element: HTMLElement;
  /** Posición superior del elemento en píxeles */
  top: number;
  /** Altura del elemento en píxeles */
  height: number;
}

/**
 * Directiva que crea un stepper vertical animado con efectos neón.
 *
 * Esta directiva genera automáticamente una línea de progreso vertical con puntos
 * indicadores que se activan conforme el usuario hace scroll. Los elementos con el
 * atributo `[step]` dentro del contenedor se detectan automáticamente.
 *
 * @example
 * ```html
 * <div appUliVerticalStepper
 *      [visible]="true"
 *      [verticalLineNeonColor]="'#00e5ff'"
 *      [stepColor]="'#ffea00'"
 *      [finalStepColor]="'#69f0ae'">
 *   <section step>Paso 1</section>
 *   <section step>Paso 2</section>
 *   <section step>Paso 3</section>
 * </div>
 * ```
 *
 * @export
 * @class VerticalStepper
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[appUliVerticalStepper]',
  standalone: true,
})
export class VerticalStepper implements AfterViewInit, OnDestroy {
  /** Controla la visibilidad del stepper */
  visible = input<boolean>(true);

  /** Paso inicial desde donde comienza el stepper (en píxeles) */
  startStep = input<number>(0);

  /** Color neón de la línea de progreso vertical */
  verticalLineNeonColor = input<string>('#00e5ff');

  /** Color de los puntos de paso intermedios */
  stepColor = input<string>('#ffea00');

  /** Color del punto del paso final */
  finalStepColor = input<string>('#69f0ae');

  /** Separación izquierda del stepper respecto al contenedor (en píxeles) */
  separateLeft = input<number>(60);

  /** Elemento overlay que contiene todos los elementos visuales del stepper */
  private overlay!: HTMLElement;

  /** Línea vertical base (rail) del stepper */
  private railLine!: HTMLElement;

  /** Línea de progreso animada que crece con el scroll */
  private progressLine!: HTMLElement;

  /** Array de elementos HTML que representan los puntos indicadores */
  private readonly dots: HTMLElement[] = [];

  /** Array de elementos HTML marcados con el atributo [step] */
  private stepElements: HTMLElement[] = [];

  /** Posiciones verticales de cada elemento step relativo al host */
  private stepPositions: number[] = [];

  /** Elemento host de la directiva */
  private host!: HTMLElement;

  /** Posición Y mínima (primer paso) */
  private minY = 0;

  /** Posición Y máxima (último paso) */
  private maxY = 0;

  /** Observer para detectar intersección de elementos con el viewport */
  private io?: IntersectionObserver;

  /** Observer para detectar cambios de tamaño en el host */
  private resizeObs?: ResizeObserver;

  /** Handler para eventos de scroll */
  private scrollHandler?: () => void;

  /** Número total de pasos detectados */
  private stepCount = 0;

  /** Offset izquierdo calculado para el posicionamiento del overlay */
  private offsetLeft = 60;

  /** Selectores CSS de los elementos step iniciales para tracking */
  private initialStepSelectors: string[] = [];

  /**
   * Crea una instancia de VerticalStepper.
   *
   * @param {ElementRef} el - Referencia al elemento host
   * @param {Renderer2} renderer - Servicio de renderizado de Angular
   */
  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2
  ) {
    effect(() => {
      const isVisible = this.visible();
      if (this.overlay) {
        this.renderer.setStyle(this.overlay, 'display', isVisible ? 'block' : 'none');
      }
    });
  }

  /**
   * Calcula la posición superior de un elemento relativo a un ancestro.
   *
   * @private
   * @param {HTMLElement} el - Elemento del cual calcular la posición
   * @param {HTMLElement} ancestor - Elemento ancestro de referencia
   * @returns {number} Posición superior en píxeles
   */
  private getOffsetTopTo(el: HTMLElement, ancestor: HTMLElement): number {
    let y = 0;
    let node: HTMLElement | null = el;
    while (node && node !== ancestor) {
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return y;
  }

  /**
   * Crea un selector CSS único para un elemento step.
   *
   * Genera un selector suficientemente específico que incluye tag, id, clases,
   * atributo step y posición si es necesario para garantizar unicidad.
   *
   * @private
   * @param {HTMLElement} el - Elemento para el cual crear el selector
   * @returns {string} Selector CSS único
   */
  private createElementSelector(el: HTMLElement): string {
    const tagName = el.tagName.toLowerCase();
    const id = el.id ? `#${el.id}` : '';
    const classes = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
    const stepAttr = el.getAttribute('step') ? `[step="${el.getAttribute('step')}"]` : '[step]';

    let selector = tagName + id + classes + stepAttr;

    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === el.tagName && child.hasAttribute('step')
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(el);
        selector += `:nth-of-type(${index + 1})`;
      }
    }

    return selector;
  }

  /**
   * Genera un efecto de brillo (glow) CSS para un color dado.
   *
   * @private
   * @param {string} color - Color en formato CSS (hex, rgb, etc.)
   * @returns {string} String de CSS box-shadow con efecto neón
   */
  private glow(color: string): string {
    return `0 0 6px ${color}, 0 0 14px ${color}, 0 0 22px ${color}`;
  }

  /**
   * Hook del ciclo de vida de Angular ejecutado después de inicializar la vista.
   *
   * Inicializa todos los elementos visuales del stepper: overlay, líneas, puntos
   * indicadores y configura los observers necesarios para la funcionalidad reactiva.
   *
   * @memberof VerticalStepper
   */
  ngAfterViewInit() {
    requestAnimationFrame(() => {
      const host: HTMLElement = (this.host = this.el.nativeElement as HTMLElement);
      const stepNodeList = host.querySelectorAll<HTMLElement>('[step]');
      const stepCount = (this.stepCount = stepNodeList.length);

      this.renderer.setStyle(host, 'position', 'relative');

      const overlay = this.renderer.createElement('div') as HTMLElement;
      this.overlay = overlay;
      this.renderer.setStyle(overlay, 'position', 'absolute');

      this.offsetLeft = Math.max(0, Number(this.separateLeft()))
      this.renderer.setStyle(overlay, 'width', `${this.offsetLeft + 60}px`);
      this.renderer.setStyle(overlay, 'pointer-events', 'none');
      this.renderer.setStyle(overlay, 'z-index', '9999');
      this.renderer.setStyle(overlay, 'overflow', 'visible');

      this.renderer.setStyle(overlay, 'display', this.visible() ? 'block' : 'none');

      const doc = this.host.ownerDocument || document;
      this.renderer.appendChild(doc.body, overlay);
      this.updateOverlayPosition();

      if (stepCount) {
        this.stepElements = Array.from(stepNodeList);
        this.initialStepSelectors = this.stepElements.map(el => this.createElementSelector(el));
        this.stepPositions = this.stepElements.map(el => this.getOffsetTopTo(el, host));
        this.minY = Math.min(...this.stepPositions);
        this.maxY = Math.max(...this.stepPositions);
        const lineLeft = 0;
        const fullRail = this.renderer.createElement('div') as HTMLElement;
        this.railLine = fullRail;
        this.renderer.setStyle(fullRail, 'position', 'absolute');
        this.renderer.setStyle(fullRail, 'left', `${lineLeft}px`);
        this.renderer.setStyle(fullRail, 'top', `${this.startStep() + this.minY}px`);
        const fullRailHeight = Math.max(0, this.maxY - this.minY) || 1;
        this.renderer.setStyle(fullRail, 'height', `${fullRailHeight}px`);
        this.renderer.setStyle(fullRail, 'width', '3px');
        this.renderer.setStyle(fullRail, 'background-color', '#b0bec519');
        this.renderer.setStyle(fullRail, 'border-radius', '2px');
        this.renderer.appendChild(overlay, fullRail);

        const progress = this.renderer.createElement('div') as HTMLElement;
        this.progressLine = progress;
        this.renderer.setStyle(progress, 'position', 'absolute');
        this.renderer.setStyle(progress, 'left', `${lineLeft}px`);
        this.renderer.setStyle(progress, 'top', `${this.startStep() + this.minY}px`);
        this.renderer.setStyle(progress, 'width', '3px');
        this.renderer.setStyle(progress, 'height', '0px');
        const lineColor = this.verticalLineNeonColor().toString().trim();
        this.renderer.setStyle(progress, 'background-color', lineColor);
        this.renderer.setStyle(progress, 'box-shadow', this.glow(lineColor));
        this.renderer.setStyle(progress, 'border-radius', '2px');
        this.renderer.appendChild(overlay, progress);

        const dotSize = 20;
        const dotRadius = dotSize / 2;
        const inactiveBg = '#eceff1';
        const inactiveBorder = '#90a4ae';

        let index = 0;
        for (const y of this.stepPositions) {
          const stepPoint = this.renderer.createElement('div') as HTMLElement;
          this.renderer.setStyle(stepPoint, 'position', 'absolute');
          this.renderer.setStyle(stepPoint, 'left', `${lineLeft - dotRadius}px`);
          this.renderer.setStyle(stepPoint, 'top', `${this.startStep() + y - dotRadius}px`);
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
          this.renderer.appendChild(overlay, stepPoint);
          this.dots.push(stepPoint);
          index++;
        }
      }

      this.setupObservers();
    });
  }

  /**
   * Configura los observers necesarios para la reactividad del stepper.
   *
   * Inicializa:
   * - IntersectionObserver para detectar cuando los pasos entran en el viewport
   * - ResizeObserver para recalcular posiciones al cambiar el tamaño del contenedor
   * - Scroll listener para actualizar la línea de progreso
   *
   * @private
   * @memberof VerticalStepper
   */
  private setupObservers() {
    if (this.io) this.io.disconnect();
    this.io = new IntersectionObserver(
      () => {
        this.updateProgressFromViewport();
      },
      { root: null, rootMargin: '0px 0px -100px 0px', threshold: 0 }
    );
    for (const el of this.stepElements) {
      this.io.observe(el);
    }

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(() => {
        this.recomputeLayout();
      });
      this.resizeObs.observe(this.host);
    }

    this.scrollHandler = () => {
      this.updateOverlayPosition();
      this.updateProgressFromViewport();
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  /**
   * Recalcula el layout del stepper cuando cambia el tamaño del contenedor.
   *
   * Actualiza posiciones de pasos, líneas y puntos para mantener la sincronización
   * con los elementos step después de cambios de tamaño o layout.
   *
   * @private
   * @memberof VerticalStepper
   */
  private recomputeLayout() {
    const host = this.host;
    this.stepPositions = this.stepElements.map(el => this.getOffsetTopTo(el, host));
    this.minY = Math.min(...this.stepPositions);
    this.maxY = Math.max(...this.stepPositions);

    this.updateOverlayPosition();

    const fullRailTop = this.startStep() + this.minY;
    const fullRailHeight = Math.max(0, this.maxY - this.minY) || 1;
    this.renderer.setStyle(this.railLine, 'top', `${fullRailTop}px`);
    this.renderer.setStyle(this.railLine, 'height', `${fullRailHeight}px`);
    this.renderer.setStyle(this.progressLine, 'top', `${fullRailTop}px`);

    const dotRadius = (Number.parseFloat(this.dots[0]?.style.width || '20') || 20) / 2;
    let i = 0;
    for (const dot of this.dots) {
      const y = this.stepPositions[i];
      this.renderer.setStyle(dot, 'top', `${this.startStep() + y - dotRadius}px`);
      i++;
    }

    this.updateProgressFromViewport();
  }

  /**
   * Actualiza la altura de la línea de progreso basándose en la posición del scroll.
   *
   * Calcula dinámicamente la altura de la línea de progreso considerando:
   * - La posición del viewport
   * - Un gap de 100px desde el fondo de la pantalla
   * - Los límites del último paso
   *
   * También activa/desactiva los puntos indicadores con efectos visuales cuando
   * la línea de progreso los alcanza.
   *
   * @private
   * @memberof VerticalStepper
   */
  private updateProgressFromViewport() {
    if (!this.progressLine) return;

    const hostRect = this.host.getBoundingClientRect();
    const hostTopAbs = hostRect.top + window.scrollY;
    const viewportBottomAbs = window.scrollY + window.innerHeight;
    const bottomGap = 100;

    const progressTopAbs = hostTopAbs + this.startStep() + this.minY;
    const allowedBottomAbs = viewportBottomAbs - bottomGap;
    const lastStepAbs = hostTopAbs + this.startStep() + this.maxY;
    const desiredBottomAbs = Math.min(allowedBottomAbs, lastStepAbs);
    const fullRailHeight = Math.max(0, this.maxY - this.minY);
    const height = Math.max(0, Math.min(fullRailHeight, desiredBottomAbs - progressTopAbs));

    this.renderer.setStyle(this.progressLine, 'height', `${height}px`);

    const progressBottomAbs = progressTopAbs + height;
    const dotBaseRadius = 10;
    let i = 0;
    for (const dot of this.dots) {
      const dotCenterAbs = hostTopAbs + this.startStep() + this.stepPositions[i];
      const dotTopAbs = dotCenterAbs - dotBaseRadius;
      const isTouched = progressBottomAbs >= dotTopAbs;

      if (isTouched) {
        const isLast = i === this.dots.length - 1;
        const activeColor = isLast
          ? this.finalStepColor().toString().trim()
          : this.stepColor().toString().trim();
        const glowEffect = this.glow(activeColor);

        this.renderer.setStyle(dot, 'background-color', activeColor);
        this.renderer.removeStyle(dot, 'border');
        this.renderer.setStyle(dot, 'color', '#111');
        this.renderer.setStyle(dot, 'box-shadow', glowEffect);
        this.renderer.setStyle(dot, 'transform', 'scale(1.2)');
        this.renderer.setStyle(dot, 'z-index', '10');
        this.renderer.setProperty(dot, 'innerText', `${i + 1}/${this.stepCount}`);
      } else {
        this.renderer.setStyle(dot, 'background-color', '#eceff1');
        this.renderer.setStyle(dot, 'border', '2px solid #90a4ae');
        this.renderer.setStyle(dot, 'color', '#263238');
        this.renderer.setStyle(dot, 'box-shadow', 'none');
        this.renderer.setStyle(dot, 'transform', 'scale(0.7)');
        this.renderer.removeStyle(dot, 'z-index');
        this.renderer.setProperty(dot, 'innerText', '');
      }
      i++;
    }
  }

  /**
   * Actualiza la posición absoluta del overlay en la página.
   *
   * Mantiene el overlay sincronizado con la posición del elemento host,
   * especialmente útil durante scroll y cambios de layout.
   *
   * @private
   * @memberof VerticalStepper
   */
  private updateOverlayPosition() {
    if (!this.overlay || !this.host) return;
    const rect = this.host.getBoundingClientRect();
    const topAbs = window.scrollY + rect.top;
    const leftAbs = window.scrollX + rect.left - this.offsetLeft;
    this.renderer.setStyle(this.overlay, 'top', `${topAbs}px`);
    this.renderer.setStyle(this.overlay, 'left', `${leftAbs}px`);
  }

  /**
   * Hook del ciclo de vida de Angular ejecutado al destruir el componente.
   *
   * Limpia todos los observers y event listeners para prevenir memory leaks,
   * y remueve el overlay del DOM.
   *
   * @memberof VerticalStepper
   */
  ngOnDestroy(): void {
    if (this.io) {
      this.io.disconnect();
      this.io = undefined;
    }
    if (this.resizeObs) {
      this.resizeObs.disconnect();
      this.resizeObs = undefined;
    }
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = undefined;
    }
    this.overlay?.remove();
  }
}
