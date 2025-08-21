import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-shower',
  imports: [],
  template: `
    <div class="code-container">
      <div class="code-header">
        <span class="language-tag">{{ language().toUpperCase() }}</span>
        <button class="copy-btn" (click)="copyToClipboard()" [class.copied]="isCopied()">
          {{ isCopied() ? '✓ Copiado' : '📋 Copiar' }}
        </button>
      </div>
      <div class="code-wrapper">
        <div class="line-numbers">
          @for (lineNumber of lineNumbers(); track lineNumber) {
            <span class="line-number">{{ lineNumber }}</span>
          }
        </div>
        <pre class="code-content" [class]="'language-' + language()"><code [innerHTML]="highlightedCode()"></code></pre>
      </div>
    </div>
  `,
  styles: `
    .code-container {
      margin: 1rem 0;
      border-radius: 12px;
      overflow: hidden;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%);
      border: 1px solid rgba(148, 163, 184, 0.2);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .code-header {
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

    .code-wrapper {
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
    .code-wrapper::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .code-wrapper::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.5);
    }

    .code-wrapper::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.3);
      border-radius: 4px;

      &:hover {
        background: rgba(148, 163, 184, 0.5);
      }
    }

    /* Estilos de syntax highlighting con colores vibrantes */
    :global(.keyword) {
      color: #ff6b9d;
      font-weight: 600;
    } /* Rosa vibrante */
    :global(.string) {
      color: #06d6a0;
      font-weight: 500;
    } /* Verde vibrante */
    :global(.comment) {
      color: #64748b;
      font-style: italic;
      opacity: 0.8;
    } /* Gris para comentarios */
    :global(.number) {
      color: #ffd23f;
      font-weight: 500;
    } /* Amarillo fuerte */
    :global(.operator) {
      color: #6366f1;
      font-weight: 600;
    } /* Azul vibrante */
    :global(.punctuation) {
      color: #94a3b8;
    } /* Gris claro para puntuación */
    :global(.function) {
      color: #00d4ff;
      font-weight: 600;
    } /* Celeste vibrante */
    :global(.variable) {
      color: #e879f9;
      font-weight: 500;
    } /* Lila vibrante */
    :global(.property) {
      color: #22c55e;
      font-weight: 500;
    } /* Verde diferente */
    :global(.selector) {
      color: #ff6b9d;
      font-weight: 600;
    } /* Rosa para selectores CSS */
    :global(.tag) {
      color: #ff6347;
      font-weight: 600;
    } /* Naranja vibrante para tags HTML */
    :global(.attr-name) {
      color: #ffd23f;
      font-weight: 500;
    } /* Amarillo para atributos */
    :global(.attr-value) {
      color: #06d6a0;
      font-weight: 500;
    } /* Verde para valores */
    :global(.builtin) {
      color: #6366f1;
      font-weight: 500;
    } /* Azul para built-ins */
    :global(.type) {
      color: #00d4ff;
      font-weight: 600;
    } /* Celeste para tipos */
    :global(.decorator) {
      color: #ffa726;
      font-weight: 600;
    } /* Naranja para decoradores */

    @media (max-width: 768px) {
      .code-header {
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeShowerComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('typescript');
  readonly title = input<string>('');
  readonly autoClean = input<boolean>(true);

  protected readonly isCopied = signal(false);

  readonly cleanCode = computed(() => {
    if (!this.autoClean()) {
      return this.code();
    }

    const code = this.code().trim();
    const lines = code.split('\n');

    // Encontrar la indentación mínima común (excluyendo líneas vacías)
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    if (nonEmptyLines.length === 0) return code;

    const minIndentation = Math.min(
      ...nonEmptyLines.map(line => {
        const match = line.match(/^(\s*)/);
        return match ? match[1].length : 0;
      })
    );

    // Remover la indentación común de todas las líneas
    const cleanedLines = lines.map(line => {
      if (line.trim().length === 0) return line; // Mantener líneas vacías como están
      return line.substring(minIndentation);
    });

    return cleanedLines.join('\n');
  });

  readonly lineNumbers = computed(() => {
    const lines = this.cleanCode().split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  });

  readonly highlightedCode = computed(() => {
    return this.highlightSyntax(this.cleanCode(), this.language());
  });

  copyToClipboard() {
    navigator.clipboard
      .writeText(this.cleanCode())
      .then(() => {
        this.isCopied.set(true);
        setTimeout(() => this.isCopied.set(false), 2000);
      })
      .catch(err => {
        console.error('Error al copiar:', err);
      });
  }

  private highlightSyntax(code: string, language: string): string {
    if (language !== 'typescript' && language !== 'javascript') {
      return this.escapeHtml(code);
    }

    // Parse the code character by character to avoid conflicts
    let result = '';
    let i = 0;
    const len = code.length;

    while (i < len) {
      // Check for comments first
      if (i < len - 1 && code[i] === '/' && code[i + 1] === '/') {
        // Single line comment
        let commentEnd = code.indexOf('\n', i);
        if (commentEnd === -1) commentEnd = len;
        const comment = code.substring(i, commentEnd);
        result += `<span class="comment">${this.escapeHtml(comment)}</span>`;
        i = commentEnd;
        continue;
      }

      if (i < len - 1 && code[i] === '/' && code[i + 1] === '*') {
        // Multi-line comment
        let commentEnd = code.indexOf('*/', i + 2);
        if (commentEnd === -1) commentEnd = len;
        else commentEnd += 2;
        const comment = code.substring(i, commentEnd);
        result += `<span class="comment">${this.escapeHtml(comment)}</span>`;
        i = commentEnd;
        continue;
      }

      // Check for strings
      if (code[i] === '"') {
        let stringEnd = i + 1;
        while (stringEnd < len && (code[stringEnd] !== '"' || code[stringEnd - 1] === '\\')) {
          stringEnd++;
        }
        if (stringEnd < len) stringEnd++; // Include the closing quote
        const string = code.substring(i, stringEnd);
        result += `<span class="string">${this.escapeHtml(string)}</span>`;
        i = stringEnd;
        continue;
      }

      if (code[i] === "'") {
        let stringEnd = i + 1;
        while (stringEnd < len && (code[stringEnd] !== "'" || code[stringEnd - 1] === '\\')) {
          stringEnd++;
        }
        if (stringEnd < len) stringEnd++; // Include the closing quote
        const string = code.substring(i, stringEnd);
        result += `<span class="string">${this.escapeHtml(string)}</span>`;
        i = stringEnd;
        continue;
      }

      if (code[i] === '`') {
        let stringEnd = i + 1;
        while (stringEnd < len && (code[stringEnd] !== '`' || code[stringEnd - 1] === '\\')) {
          stringEnd++;
        }
        if (stringEnd < len) stringEnd++; // Include the closing backtick
        const string = code.substring(i, stringEnd);
        result += `<span class="string">${this.escapeHtml(string)}</span>`;
        i = stringEnd;
        continue;
      }

      // Check for keywords
      if (/[a-zA-Z_]/.test(code[i])) {
        let wordEnd = i;
        while (wordEnd < len && /[a-zA-Z0-9_]/.test(code[wordEnd])) {
          wordEnd++;
        }
        const word = code.substring(i, wordEnd);

        const keywords = [
          'export',
          'import',
          'class',
          'interface',
          'const',
          'let',
          'var',
          'function',
          'return',
          'if',
          'else',
          'for',
          'while',
          'do',
          'switch',
          'case',
          'break',
          'continue',
          'try',
          'catch',
          'finally',
          'throw',
          'new',
          'this',
          'super',
          'extends',
          'implements',
          'public',
          'private',
          'protected',
          'static',
          'readonly',
          'async',
          'await',
          'type',
          'typeof',
          'keyof',
          'in',
          'of',
          'instanceof',
          'as',
          'from',
          'default',
          'namespace',
          'module',
          'declare',
          'abstract',
          'boolean',
          'number',
          'string',
          'void',
          'null',
          'undefined',
          'any',
          'unknown',
          'never',
          'object',
          'symbol',
        ];

        if (keywords.includes(word)) {
          result += `<span class="keyword">${this.escapeHtml(word)}</span>`;
        } else {
          result += this.escapeHtml(word);
        }
        i = wordEnd;
        continue;
      }

      // Check for numbers
      if (/\d/.test(code[i])) {
        let numberEnd = i;
        while (numberEnd < len && /[\d.]/.test(code[numberEnd])) {
          numberEnd++;
        }
        const number = code.substring(i, numberEnd);
        result += `<span class="number">${this.escapeHtml(number)}</span>`;
        i = numberEnd;
        continue;
      }

      // Handle whitespace (preserve spaces, tabs, newlines)
      if (/\s/.test(code[i])) {
        let whitespaceEnd = i;
        while (whitespaceEnd < len && /\s/.test(code[whitespaceEnd])) {
          whitespaceEnd++;
        }
        const whitespace = code.substring(i, whitespaceEnd);
        result += this.escapeHtml(whitespace);
        i = whitespaceEnd;
        continue;
      }

      // Regular character (operators, punctuation, etc.)
      result += this.escapeHtml(code[i]);
      i++;
    }

    return result;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
