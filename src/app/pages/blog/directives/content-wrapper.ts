import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  AfterViewChecked,
  computed,
  inject,
  input,
  signal,
  output,
} from '@angular/core';
import { SeeMoreService } from '../services/see-more.service';

@Directive({
  selector: '[appContentWrapper]',
  standalone: true,
})
export class ContentWrapperDirective implements AfterViewInit, AfterViewChecked {
  private readonly seeMoreService = inject(SeeMoreService);
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  entryId = input.required<number>();

  // Output para notificar cuando el estado de expansión cambia
  isCollapsed = output<boolean>();

  private readonly seeMorePointElement = signal<HTMLElement | null>(null);
  private readonly collapsedHeight = signal<string>('300px');
  private seeMorePointFound = false;

  private container!: HTMLElement;
  private contentInner!: HTMLElement;
  private fadeOverlay!: HTMLElement;
  private controlsContainer!: HTMLElement;
  private seeMoreBtn!: HTMLElement;
  private seeLessBtn!: HTMLElement;

  protected readonly hasSeeMorePoint = computed(() => {
    return this.seeMorePointElement() !== null;
  });

  protected readonly isExpanded = computed(() => {
    return this.seeMoreService.isExpanded(this.entryId());
  });

  protected readonly maxHeight = computed(() => {
    const expanded = this.isExpanded();
    const hasPoint = this.hasSeeMorePoint();
    return expanded || !hasPoint ? 'none' : this.collapsedHeight();
  });

  ngAfterViewInit(): void {
    this.createWrapperStructure();
    this.findSeeMorePoint();
  }

  ngAfterViewChecked(): void {
    if (!this.seeMorePointFound) {
      this.findSeeMorePoint();
    }
  }

  private createWrapperStructure(): void {
    const hostElement = this.el.nativeElement as HTMLElement;

    // Crear el contenedor principal
    this.container = this.renderer.createElement('div');
    this.renderer.addClass(this.container, 'blog-content-container');
    this.renderer.setStyle(this.container, 'position', 'relative');
    this.renderer.setStyle(this.container, 'overflow', 'visible');

    // Crear el contenedor interno
    this.contentInner = this.renderer.createElement('div');
    this.renderer.addClass(this.contentInner, 'content-inner');
    this.renderer.setStyle(this.contentInner, 'position', 'relative');
    this.renderer.setStyle(this.contentInner, 'transition', 'max-height 0.4s ease-in-out');

    // Crear el fade overlay
    this.fadeOverlay = this.renderer.createElement('div');
    this.renderer.addClass(this.fadeOverlay, 'fade-overlay');
    this.renderer.setStyle(this.fadeOverlay, 'position', 'absolute');
    this.renderer.setStyle(this.fadeOverlay, 'inset', 'auto 0 0 0');
    this.renderer.setStyle(this.fadeOverlay, 'height', '200px');
    this.renderer.setStyle(this.fadeOverlay, 'background', 'linear-gradient(transparent, rgba(0,0,0,1))');
    this.renderer.setStyle(this.fadeOverlay, 'pointer-events', 'none');
    this.renderer.setStyle(this.fadeOverlay, 'z-index', '1');
    this.renderer.setStyle(this.fadeOverlay, 'display', 'none');

    // Crear controles
    this.controlsContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.controlsContainer, 'see-more-controls');
    this.renderer.setStyle(this.controlsContainer, 'display', 'none');

    // Botón "Ver más"
    this.seeMoreBtn = this.renderer.createElement('button');
    this.renderer.addClass(this.seeMoreBtn, 'see-more-btn');
    this.renderer.setProperty(this.seeMoreBtn, 'textContent', 'Ver más ▼');
    this.applyButtonStyles(this.seeMoreBtn, false);
    this.renderer.listen(this.seeMoreBtn, 'click', () => this.toggleExpanded());

    // Botón "Ver menos"
    this.seeLessBtn = this.renderer.createElement('button');
    this.renderer.addClass(this.seeLessBtn, 'see-less-btn');
    this.renderer.setProperty(this.seeLessBtn, 'textContent', 'Ver menos ▲');
    this.applyButtonStyles(this.seeLessBtn, true);
    this.renderer.listen(this.seeLessBtn, 'click', () => this.toggleExpanded());

    // Mover todo el contenido del elemento host al contentInner
    while (hostElement.firstChild) {
      this.renderer.appendChild(this.contentInner, hostElement.firstChild);
    }

    // Construir la estructura
    this.renderer.appendChild(this.contentInner, this.fadeOverlay);
    this.renderer.appendChild(this.container, this.contentInner);
    this.renderer.appendChild(this.controlsContainer, this.seeMoreBtn);
    this.renderer.appendChild(this.controlsContainer, this.seeLessBtn);
    this.renderer.appendChild(this.container, this.controlsContainer);
    this.renderer.appendChild(hostElement, this.container);

    // Aplicar estilos iniciales
    this.updateWrapperState();
  }

  private applyButtonStyles(button: HTMLElement, isLess: boolean): void {
    const baseStyles = {
      border: 'none',
      padding: '.75rem 1.5rem',
      'border-radius': '25px',
      'font-weight': '600',
      cursor: 'pointer',
      transition: '.3s',
      'font-size': '.9rem',
      'text-transform': 'uppercase',
      'letter-spacing': '.5px',
      'text-wrap': 'nowrap',
      color: '#fff',
    };

    for (const [prop, value] of Object.entries(baseStyles)) {
      this.renderer.setStyle(button, prop, value);
    }

    if (isLess) {
      this.renderer.setStyle(button, 'background', 'linear-gradient(135deg,#764ba22f 0%,#667eea2f 100%)');
    } else {
      this.renderer.setStyle(button, 'background', 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)');
    }

    this.renderer.listen(button, 'mouseenter', () => {
      this.renderer.setStyle(button, 'transform', 'translateY(-2px)');
      this.renderer.setStyle(button, 'box-shadow', '0 8px 25px rgba(102,126,234,.4)');
    });

    this.renderer.listen(button, 'mouseleave', () => {
      this.renderer.setStyle(button, 'transform', 'translateY(0)');
      this.renderer.setStyle(button, 'box-shadow', 'none');
    });
  }

  private findSeeMorePoint(): void {
    if (this.seeMorePointFound) {
      return;
    }

    const seeMoreElement = this.contentInner.querySelector('[data-see-more-point]') as HTMLElement;
    if (seeMoreElement) {
      this.seeMorePointElement.set(seeMoreElement);
      this.calculateCollapsedHeight(seeMoreElement);
      this.seeMorePointFound = true;
      this.updateWrapperState();
    }
  }

  private calculateCollapsedHeight(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    if (containerRect) {
      const relativeTop = rect.top - containerRect.top;
      const finalHeight = Math.max(relativeTop + 50, 200);
      this.collapsedHeight.set(`${finalHeight}px`);
    }
  }

  private updateWrapperState(): void {
    const expanded = this.isExpanded();
    const hasPoint = this.hasSeeMorePoint();
    const height = this.maxHeight();

    if (!hasPoint) {
      // No hay punto de "ver más", ocultar controles
      this.renderer.setStyle(this.controlsContainer, 'display', 'none');
      this.renderer.setStyle(this.fadeOverlay, 'display', 'none');
      this.renderer.removeClass(this.contentInner, 'collapsed');
      this.renderer.setStyle(this.contentInner, 'max-height', 'none');
      this.isCollapsed.emit(false);
      return;
    }

    // Hay punto de "ver más"
    this.renderer.setStyle(this.controlsContainer, 'display', 'flex');
    this.renderer.setStyle(this.controlsContainer, 'justify-content', 'center');

    if (expanded) {
      // Estado expandido
      this.renderer.removeClass(this.contentInner, 'collapsed');
      this.renderer.setStyle(this.contentInner, 'max-height', 'none');
      this.renderer.setStyle(this.contentInner, 'overflow', 'visible');
      this.renderer.setStyle(this.contentInner, 'border-radius', '0');
      this.renderer.setStyle(this.fadeOverlay, 'display', 'none');

      this.renderer.setStyle(this.seeMoreBtn, 'display', 'none');
      this.renderer.setStyle(this.seeLessBtn, 'display', 'block');

      this.renderer.setStyle(this.controlsContainer, 'left', '0%');
      this.renderer.setStyle(this.controlsContainer, 'transform', 'translateX(0%)');

      // Estilo sticky para "Ver menos"
      this.renderer.removeClass(this.controlsContainer, 'state-collapsed');
      this.renderer.addClass(this.controlsContainer, 'state-expanded');
      this.renderer.setStyle(this.controlsContainer, 'position', 'sticky');
      this.renderer.setStyle(this.controlsContainer, 'bottom', '1rem');
      this.renderer.setStyle(this.controlsContainer, 'margin-top', '1rem');
      this.renderer.setStyle(this.controlsContainer, 'z-index', '5');

      this.isCollapsed.emit(false);
    } else {
      // Estado colapsado
      this.renderer.addClass(this.contentInner, 'collapsed');
      this.renderer.setStyle(this.contentInner, 'max-height', height);
      this.renderer.setStyle(this.contentInner, 'overflow', 'hidden');
      this.renderer.setStyle(this.contentInner, 'border-radius', '0px 0px 30px 30px');
      this.renderer.setStyle(this.fadeOverlay, 'display', 'block');

      this.renderer.setStyle(this.seeMoreBtn, 'display', 'block');
      this.renderer.setStyle(this.seeLessBtn, 'display', 'none');

      // Estilo absoluto para "Ver más" (flotando sobre el fade)
      this.renderer.removeClass(this.controlsContainer, 'state-expanded');
      this.renderer.addClass(this.controlsContainer, 'state-collapsed');
      this.renderer.setStyle(this.controlsContainer, 'position', 'absolute');

this.renderer.setStyle(this.controlsContainer, 'left', '50%');
      this.renderer.setStyle(this.controlsContainer, 'transform', 'translateX(-50%)');


      this.renderer.setStyle(this.controlsContainer, 'bottom', '18px');
      this.renderer.setStyle(this.controlsContainer, 'z-index', '2');
      this.renderer.setStyle(this.controlsContainer, 'margin-top', '0');

      this.isCollapsed.emit(true);
    }
  }

  protected toggleExpanded(): void {
    this.seeMoreService.toggleExpanded(this.entryId());
    // Pequeño delay para permitir que el computed se actualice
    setTimeout(() => this.updateWrapperState(), 0);
  }
}
