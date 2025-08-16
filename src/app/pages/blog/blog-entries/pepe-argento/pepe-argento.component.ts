import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';

@BlogEntry({
  category: 'General',
  title: 'Pepe Argento',
  date: new Date(),
})
@Component({
  selector: 'app-pepe-argento',
  imports: [],
  template: `
  <div class="content">
    <h2>Pepe Argento</h2>
    <p>Contenido del artÃ­culo aquÃ­...</p>
  </div>
  `,
  styles: `
  .content {
    padding: 1.5rem;
    line-height: 1.6;
    color: #e0e0e0;
  }

  h2 {
    color: #fff;
    margin-bottom: 1rem;
  }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PepeArgentoComponent {

}
