import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { SeeMoreService } from '../services/see-more.service';

@Component({
  selector: 'app-blog-content-wrapper',
  template: `
    <div
      class="blog-content-container"
      [class.collapsed]="!isExpanded()"
      [style.max-height]="maxHeight()"
      #contentContainer>
      <ng-content></ng-content>

      @if (!isExpanded() && hasSeeMorePoint()) {
        <div class="fade-overlay"></div>
      }

      @if (hasSeeMorePoint()) {
        <div class="see-more-controls">
          @if (!isExpanded()) {
            <button class="see-more-btn" (click)="toggleExpanded()">Ver más ▼</button>
          } @else {
            <button class="see-less-btn" (click)="toggleExpanded()">Ver menos ▲</button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .blog-content-container {
      position: relative;
      overflow: hidden;
      transition: max-height 0.4s ease-in-out;
    }

    .fade-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 1));
      pointer-events: none;
      z-index: 1;
    }

    .see-more-controls:has(.see-more-btn)  {
      position: absolute;
      display: flex;
      justify-content: center;
      z-index: 9999999999;
      right: 300px;
      bottom: 18px;
    }

    .see-more-controls:has(.see-less-btn){
      margin-top: 1rem;
      position: relative;
      display: flex;
      justify-content: center;
    }

    .see-more-btn,
    .see-less-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .see-more-btn:hover,
    .see-less-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .see-less-btn {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogContentWrapperComponent implements AfterViewInit, AfterViewChecked {
  private readonly seeMoreService = inject(SeeMoreService);

  entryId = input.required<number>();

  contentContainer = viewChild<ElementRef>('contentContainer');

  private readonly seeMorePointElement = signal<HTMLElement | null>(null);
  private readonly collapsedHeight = signal<string>('300px');
  private seeMorePointFound = false;

  protected readonly hasSeeMorePoint = computed(() => {
    const hasPoint = this.seeMorePointElement() !== null;
    console.log(`🎯 hasSeeMorePoint: ${hasPoint}`);
    return hasPoint;
  });

  protected readonly isExpanded = computed(() => {
    const expanded = this.seeMoreService.isExpanded(this.entryId());
    console.log(`📖 isExpanded for entry ${this.entryId()}: ${expanded}`);
    return expanded;
  });

  protected readonly maxHeight = computed(() => {
    const expanded = this.isExpanded();
    const hasPoint = this.hasSeeMorePoint();
    const height = expanded || !hasPoint ? 'none' : this.collapsedHeight();
    console.log(`📐 maxHeight: ${height} (expanded: ${expanded}, hasPoint: ${hasPoint})`);
    return height;
  });

  ngAfterViewInit(): void {
    this.findSeeMorePoint();
  }

  ngAfterViewChecked(): void {
    if (!this.seeMorePointFound) {
      this.findSeeMorePoint();
    }
  }

  private findSeeMorePoint(): void {
    if (this.seeMorePointFound) {
      return; // Ya lo encontramos, no buscar más
    }

    const container = this.contentContainer()?.nativeElement;
    if (container) {
      const seeMoreElement = container.querySelector('[data-see-more-point]') as HTMLElement;
      if (seeMoreElement) {
        this.seeMorePointElement.set(seeMoreElement);
        this.calculateCollapsedHeight(seeMoreElement);
        this.seeMorePointFound = true; // Marcar como encontrado
        console.log('✅ See more point encontrado y configurado');
      } else {
        console.log('🔍 Buscando see more point...');
      }
    }
  }

  private calculateCollapsedHeight(element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const containerRect = this.contentContainer()?.nativeElement.getBoundingClientRect();

    if (containerRect) {
      const relativeTop = rect.top - containerRect.top;
      // Agregamos un pequeño margen para el efecto de fade
      const finalHeight = Math.max(relativeTop + 50, 200); // Mínimo 200px
      this.collapsedHeight.set(`${finalHeight}px`);
      console.log(`📏 Altura calculada: ${finalHeight}px (relativeTop: ${relativeTop}px)`);
    }
  }

  protected toggleExpanded(): void {
    const entryId = this.entryId();
    const currentState = this.seeMoreService.isExpanded(entryId);
    console.log(`🔄 Toggle expanded para entry ${entryId}: ${currentState} -> ${!currentState}`);
    this.seeMoreService.toggleExpanded(entryId);
  }
}
