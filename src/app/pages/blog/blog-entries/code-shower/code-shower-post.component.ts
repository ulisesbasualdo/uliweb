import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlogEntry } from '../../decorators/blog-entry.decorator';
import { CodeShower } from '../../../../shared/components/code-shower/code-shower';
import { ContentWrapperDirective } from '../../directives/content-wrapper';
import { BlogService } from '../../services/blog.service';
import { BlogHeader } from "../../components/blog-header";

@BlogEntry({
  category: 'General',
  title: 'Cómo crear un Code Shower reutilizable en Angular',
  date: new Date('2025-12-01'),
  needsWrap: true,
})
@Component({
  selector: 'app-code-shower-post',
  imports: [CodeShower, ContentWrapperDirective, BlogHeader],
  template: `
    <article appContentWrapper [entryId]="entryId">
      <app-blog-header
        src="blog-img/code-shower.jpg"
        alt="Un extraterrestre entregando un maletín con código a un humano futurista"
      />
      <p>
        Un "code shower" es un componente que muestra bloques de código con formato adecuado y funcionalidades como
        copiar al portapapeles. En este artículo, te comparto los archivos necesarios para el code shower.
      </p>
      <uli-code-shower [code]="htmlCode" language="html" />

      <uli-code-shower data-see-more-point  [code]="scssCode" language="scss" />
      <uli-code-shower [code]="tsCode" language="typescript" />
    </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeShowerPostComponent {
  private readonly blogService = inject(BlogService);
  protected get entryId(): number {
    const entry = this.blogService.allEntries().find(e => e.component === CodeShowerPostComponent);
    return entry?.id ?? 1;
  }

  htmlCode = `<div class="container">

  <div class="header">
    <span class="language-tag">{{language() | titlecase }}</span>
    <button class="copy-btn" (click)="copyToClipboard()" [class.copied]="isCodeCopied()">
      {{isCodeCopied() ? '✓ copiado' : '📋 copiar'}}
    </button>
  </div>

  <div class="wrapper">
    <div class="line-numbers">
      @for(lineNumber of lineNumbers();track $index){
        <span class="line-number">{{ lineNumber }}</span>
      }
    </div>
    <pre class="code-content"><code [innerHTML]="processedCode()"></code></pre>
  </div>

</div>`;

  scssCode = `.container {
  margin: 1rem 0;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.language-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ff6b9d;
  background: rgba(255, 107, 157, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 107, 157, 0.3);
}

.copy-btn {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    color: #818cf8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  &.copied {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    border-color: rgba(34, 197, 94, 0.3);
  }
}

.wrapper {
  display: flex;
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

.line-numbers {
  background: rgba(15, 23, 42, 0.6);
  padding: 1rem 0.5rem 1.5rem 1rem;
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  user-select: none;
  min-width: 3rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 100%;
}

.line-number {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
}

.code-content {
  flex: 1;
  padding: 1rem 1rem 0rem 1rem;
  margin: 0;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #e2e8f0;
  background: transparent;
  overflow: visible;
  white-space: pre;
  word-wrap: normal;
}

/* Scrollbar personalizado */
.wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.wrapper::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

.wrapper::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 4px;

  &:hover {
    background: rgba(148, 163, 184, 0.5);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0.5rem;
  }

  .language-tag {
    font-size: 0.7rem;
  }

  .copy-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .code-content {
    font-size: 0.8rem;
    padding: 0.75rem;
  }

  .line-numbers {
    padding: 0.75rem 0.4rem 0.75rem 0.75rem;
    min-width: 2.5rem;
  }
}
`;
  tsCode = `import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-shower, uli-code-shower',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './code-shower.html',
  styleUrl: './code-shower.scss',
  imports: [TitleCasePipe],
})
export class CodeShower {
  public code = input.required<string>();
  public language = input<string>('javascript');
  protected isCodeCopied = signal<boolean>(false);

  processedCode = computed<string>(() => {
    const code = this.code().trim();
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    if (nonEmptyLines.length === 0) return '';

    const minIndentation = Math.min(
      ...nonEmptyLines.map(line => {
        const match = new RegExp(/^(\s*)/).exec(line);
        return match ? match[1].length : 0;
      })
    );

    const identedLines = lines.map(line => {
      if (line.trim().length === 0) return line;
      return line.substring(minIndentation);
    });

    return this.escapeHtml(identedLines.join('\n'));
  });

  readonly lineNumbers = computed(() => {
    const lines = this.processedCode().split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  });


  copyToClipboard() {
    navigator.clipboard
      .writeText(this.code())
      .then(() => {
        this.isCodeCopied.set(true);
        setTimeout(() => this.isCodeCopied.set(false), 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
      });
  }

  private escapeHtml(text: string): string {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
  }
}
`;
}
