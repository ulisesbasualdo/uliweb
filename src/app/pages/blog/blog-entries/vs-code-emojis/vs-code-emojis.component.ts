import { Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';
import { BlogHeader } from '../../components/blog-header';

@BlogEntry({
  category: 'Angular',
  title: 'Cómo insertar emojis en Visual Studio Code',
  needsWrap: false,
  date: new Date('2025-08-15'),
})
@Component({
  selector: 'app-vs-code-emojis',
  imports: [BlogHeader],
  template: `
    <app-blog-header
      src="blog-img/emojis-vs-code.jpg"
      alt="Emojis en vs-code" />
    <p>Con las teclas "windows" + "." se abre un popup para insertar emojis</p>
  `,
  styles: ``,
})
export class VsCodeEmojisComponent {}
