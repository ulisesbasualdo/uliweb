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
    <div class="blog-content-container" #contentContainer>
      <div
        class="content-inner"
        [class.collapsed]="!isExpanded()"
        [attr.data-content-collapsed]="!isExpanded()"
        [style.max-height]="maxHeight()">
        <ng-content></ng-content>

        @if (!isExpanded() && hasSeeMorePoint()) {
          <div class="fade-overlay"></div>
        }
      </div>

      @if (hasSeeMorePoint()) {
        <div
          class="see-more-controls"
          [class.state-collapsed]="!isExpanded()"
          [class.state-expanded]="isExpanded()">
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
      overflow: visible;
    }

    .content-inner {
      position: relative;
      transition: max-height 0.4s ease-in-out;
    }

    .content-inner.collapsed {
      overflow: hidden;
      border-radius:30px;
    }

    .fade-overlay {
      position: absolute;
      inset: auto 0 0 0;
      height: 200px;
      background: linear-gradient(transparent, rgba(0,0,0,1));
      pointer-events: none;
      z-index: 1;
    }

    /* Botón cuando está colapsado (flotando sobre el fade) */
    .see-more-controls.state-collapsed {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 18px;
      z-index: 2;
      display: flex;
      justify-content: center;
    }

    /* Botón "Ver menos" sticky inverso: se pega al bottom hasta alcanzar su lugar natural */
    .see-more-controls.state-expanded {
      position: sticky;
      bottom: 1rem; /* separación del borde inferior */
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      z-index: 5;
    }

    .see-more-btn,
    .see-less-btn {
      background: linear-gradient(135deg,#667eea 0%,#764ba2 100%);
      color:#fff;
      border:none;
      padding:.75rem 1.5rem;
      border-radius:25px;
      font-weight:600;
      cursor:pointer;
      transition:.3s;
      font-size:.9rem;
      text-transform:uppercase;
      letter-spacing:.5px;
    }

    .see-less-btn {
      background: linear-gradient(135deg,#764ba22f 0%,#667eea2f 100%);
    }

    .see-more-btn:hover,
    .see-less-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102,126,234,.4);
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
    return hasPoint;
  });

  protected readonly isExpanded = computed(() => {
    const expanded = this.seeMoreService.isExpanded(this.entryId());
    return expanded;
  });

  protected readonly maxHeight = computed(() => {
    const expanded = this.isExpanded();
    const hasPoint = this.hasSeeMorePoint();
    const height = expanded || !hasPoint ? 'none' : this.collapsedHeight();
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
        this.seeMorePointFound = true;
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
    }
  }

  protected toggleExpanded(): void {
    const entryId = this.entryId();
    this.seeMoreService.toggleExpanded(entryId);
  }
}
