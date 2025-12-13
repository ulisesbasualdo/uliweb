import { Component, input } from '@angular/core';

@Component({
  selector: 'app-blog-header',
  template: `
    <header class="hero-section">
      <img
        [src]="src()"
        [alt]="alt()"
        class="cover-image" />
    </header>
  `,
  styles: `
    .hero-section {
      position: relative;
      margin-bottom: 3rem;
      border-radius: 1rem;
      overflow: hidden;
      text-align: center;
    }

    .cover-image {
      width: 80%;
      text-align: center;
      align-content: center;
      object-fit: cover;
      border-radius: 15px;
      border-style: solid;
    }

    @media (max-width: 768px) {
      .cover-image {
        width: 100%;
      }
    }
  `,
  standalone: true,
})
export class BlogHeader {
  src = input<string>('');
  alt = input<string>('');
}
