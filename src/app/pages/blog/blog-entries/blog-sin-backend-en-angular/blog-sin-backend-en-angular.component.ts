import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';

@BlogEntry({
  category: 'Angular',
  title: 'Blog sin backend en angular',
  date: new Date('2025-08-15'),
})
@Component({
  selector: 'app-blog-sin-backend-en-angular',
  imports: [],
  template: ` <div class="content">
      <p>Este artículo explica cómo usar Local Storage con Signals para manejo de estado persistente.</p>
      <p>Los signals proporcionan una forma reactiva de manejar el estado...</p>
    </div> `,
  styles: `.blog-entry {
      padding: 1.5rem;
      border: 1px solid #333;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      background: rgba(255, 255, 255, 0.02);

      h3 {
        margin-top: 0;
        color: #fff;
        margin-bottom: 1rem;
      }

      .content {
        line-height: 1.6;
        color: #e0e0e0;
      }
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogSinBackendEnAngularComponent {}
