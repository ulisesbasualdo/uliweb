import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div
      class="skeleton"
      [style.width]="ancho"
      [style.height]="alto"
      [style.border-radius]="radio"
      [class.animado]="animado">
    </div>
  `,
  styles: [`
    .skeleton {
      background: linear-gradient(110deg, #2d2d2d 8%, #3d3d3d 18%, #2d2d2d 33%);
      border-radius: 5px;
      background-size: 200% 100%;
    }

    .animado {
      animation: 1.5s shine linear infinite;
    }

    @keyframes shine {
      to {
        background-position-x: -200%;
      }
    }
  `]
})
export class SkeletonComponent {
  @Input() ancho: string = '100%';
  @Input() alto: string = '200px';
  @Input() radio: string = '4px';
  @Input() animado: boolean = true;
}
