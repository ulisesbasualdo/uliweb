import { Component } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';

@BlogEntry({
  category: 'Angular',
  title: 'Cómo insertar emojis en Visual Studio Code',
  needsWrap: false,
  date: new Date('2025-08-15'),
})
@Component({
  selector: 'app-vs-code-emojis',
  imports: [],
  template: `
    <p>
      Con las teclas "windows" + "." se te abre un popup para insertar emojis
    </p>
  `,
  styles: ``
})
export class VsCodeEmojisComponent {}
