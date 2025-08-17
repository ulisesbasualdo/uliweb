import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-shower',
  imports: [],
  template: `
    <div class="code-container">
      <div class="code-header">
        <span class="language-tag">{{ language().toUpperCase() }}</span>
        <button
          class="copy-btn"
          (click)="copyToClipboard()"
          [class.copied]="isCopied()"
        >
          {{ isCopied() ? '✓ Copiado' : '📋 Copiar' }}
        </button>
      </div>
      <div class="code-wrapper">
        <div class="line-numbers">
          @for (lineNumber of lineNumbers(); track lineNumber) {
            <span class="line-number">{{ lineNumber }}</span>
          }
        </div>
        <pre class="code-content" [class]="'language-' + language()">
          <code [innerHTML]="highlightedCode()"></code>
        </pre>
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
      padding: 1rem 0.5rem 1rem 1rem;
      border-right: 1px solid rgba(148, 163, 184, 0.2);
      user-select: none;
      min-width: 3rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .line-number {
      color: #64748b;
      font-size: 0.875rem;
      line-height: 1.5;
      font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
    }

    .code-content {
      flex: 1;
      padding: 1rem;
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
    :global(.keyword) { color: #ff6b9d; font-weight: 600; } /* Rosa vibrante */
    :global(.string) { color: #06d6a0; font-weight: 500; } /* Verde vibrante */
    :global(.comment) { color: #64748b; font-style: italic; opacity: 0.8; } /* Gris para comentarios */
    :global(.number) { color: #ffd23f; font-weight: 500; } /* Amarillo fuerte */
    :global(.operator) { color: #6366f1; font-weight: 600; } /* Azul vibrante */
    :global(.punctuation) { color: #94a3b8; } /* Gris claro para puntuación */
    :global(.function) { color: #00d4ff; font-weight: 600; } /* Celeste vibrante */
    :global(.variable) { color: #e879f9; font-weight: 500; } /* Lila vibrante */
    :global(.property) { color: #22c55e; font-weight: 500; } /* Verde diferente */
    :global(.selector) { color: #ff6b9d; font-weight: 600; } /* Rosa para selectores CSS */
    :global(.tag) { color: #ff6347; font-weight: 600; } /* Naranja vibrante para tags HTML */
    :global(.attr-name) { color: #ffd23f; font-weight: 500; } /* Amarillo para atributos */
    :global(.attr-value) { color: #06d6a0; font-weight: 500; } /* Verde para valores */
    :global(.builtin) { color: #6366f1; font-weight: 500; } /* Azul para built-ins */
    :global(.type) { color: #00d4ff; font-weight: 600; } /* Celeste para tipos */
    :global(.decorator) { color: #ffa726; font-weight: 600; } /* Naranja para decoradores */

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
    return this.autoClean() ? this.code().trim() : this.code();
  });

  readonly lineNumbers = computed(() => {
    const lines = this.cleanCode().split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  });

  readonly highlightedCode = computed(() => {
    return this.highlightSyntax(this.cleanCode(), this.language());
  });

  copyToClipboard() {
    navigator.clipboard.writeText(this.cleanCode()).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000);
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }

  private highlightSyntax(code: string, language: string): string {
    // Escapar HTML primero
    let highlighted = this.escapeHtml(code);

    // Aplicar patrones específicos de manera cuidadosa
    if (language === 'typescript' || language === 'javascript') {
      // Comentarios
      highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="comment">$&</span>');
      highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>');

      // Strings (evitar procesar contenido ya dentro de spans)
      highlighted = highlighted.replace(/(&quot;[^&]*?&quot;)/g, (match) => {
        if (highlighted.indexOf(match) > 0 && highlighted.charAt(highlighted.indexOf(match) - 1) === '>') {
          return match; // Ya está dentro de un span
        }
        return `<span class="string">${match}</span>`;
      });

      highlighted = highlighted.replace(/(&#39;[^&]*?&#39;)/g, (match) => {
        if (highlighted.indexOf(match) > 0 && highlighted.charAt(highlighted.indexOf(match) - 1) === '>') {
          return match;
        }
        return `<span class="string">${match}</span>`;
      });

      // Keywords
      const keywords = /\b(export|import|class|interface|const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|public|private|protected|static|readonly|async|await|type|typeof|keyof|in|of|instanceof|as|from|default|namespace|module|declare|abstract|boolean|number|string|void|null|undefined|any|unknown|never|object|symbol)\b/g;
      highlighted = highlighted.replace(keywords, '<span class="keyword">$&</span>');

      // Numbers
      highlighted = highlighted.replace(/\b\d+\.?\d*\b/g, '<span class="number">$&</span>');

      // Properties (word followed by colon)
      highlighted = highlighted.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '<span class="property">$1</span>:');
    }

    return highlighted;
  }

  private getLanguagePatterns(language: string) {
    const basePatterns = {
      typescript: [
        // Comentarios primero
        { pattern: /\/\/.*$/gm, className: 'comment' },
        { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },

        // Strings
        { pattern: /'([^'\\]|\\.)*'/g, className: 'string' },
        { pattern: /"([^"\\]|\\.)*"/g, className: 'string' },
        { pattern: /`([^`\\]|\\.)*`/g, className: 'string' },

        // Decoradores
        { pattern: /@[a-zA-Z_][a-zA-Z0-9_]*/g, className: 'decorator' },

        // Keywords
        { pattern: /\b(abstract|any|as|async|await|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|never|new|null|number|object|of|package|private|protected|public|readonly|require|return|set|static|string|super|switch|symbol|this|throw|true|try|type|typeof|undefined|unique|unknown|var|void|while|with|yield)\b/g, className: 'keyword' },

        // Types y interfaces
        { pattern: /\b[A-Z][a-zA-Z0-9]*(?=<|\s|$|\[|\.|\,|\)|;)/g, className: 'type' },

        // Properties (after : in interfaces)
        { pattern: /([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=:)/g, className: 'property' },

        // Functions
        { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },

        // Numbers
        { pattern: /\b\d+\.?\d*\b/g, className: 'number' },

        // Operators
        { pattern: /[+\-*\/%=<>!&\|^~?:]+/g, className: 'operator' },

        // Punctuation
        { pattern: /[{}()\[\];,.:]/g, className: 'punctuation' },
      ],

      javascript: [
        { pattern: /\/\/.*$/gm, className: 'comment' },
        { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
        { pattern: /'([^'\\]|\\.)*'/g, className: 'string' },
        { pattern: /"([^"\\]|\\.)*"/g, className: 'string' },
        { pattern: /`([^`\\]|\\.)*`/g, className: 'string' },
        { pattern: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield)\b/g, className: 'keyword' },
        { pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g, className: 'function' },
        { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
        { pattern: /[+\-*/%=<>!&|^~?:]+/g, className: 'operator' },
        { pattern: /[{}()\[\];,.:]/g, className: 'punctuation' },
      ],

      html: [
        { pattern: /<!--[\s\S]*?-->/g, className: 'comment' },
        { pattern: /<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^>]*)?>/g, className: 'tag' },
        { pattern: /\s[a-zA-Z-]+(?==)/g, className: 'attr-name' },
        { pattern: /=\s*"[^"]*"/g, className: 'attr-value' },
        { pattern: /=\s*'[^']*'/g, className: 'attr-value' },
      ],

      css: [
        { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
        { pattern: /[.#]?[a-zA-Z][a-zA-Z0-9-_]*(?=\s*{)/g, className: 'selector' },
        { pattern: /[a-zA-Z-]+(?=\s*:)/g, className: 'property' },
        { pattern: /:\s*[^;{}]+/g, className: 'attr-value' },
        { pattern: /[{}();]/g, className: 'punctuation' },
      ],

      scss: [
        { pattern: /\/\/.*$/gm, className: 'comment' },
        { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
        { pattern: /\$[a-zA-Z_][a-zA-Z0-9_-]*/g, className: 'variable' },
        { pattern: /@[a-zA-Z-]+/g, className: 'keyword' },
        { pattern: /[.#&%]?[a-zA-Z][a-zA-Z0-9-_]*(?=\s*[{,:])/g, className: 'selector' },
        { pattern: /[a-zA-Z-]+(?=\s*:)/g, className: 'property' },
        { pattern: /:\s*[^;{}]+/g, className: 'attr-value' },
        { pattern: /[{}();]/g, className: 'punctuation' },
      ],

      powershell: [
        { pattern: /#.*$/gm, className: 'comment' },
        { pattern: /\b(function|param|if|else|elseif|foreach|for|while|do|switch|try|catch|finally|return|break|continue|Write-Host|Get-\w+|Set-\w+|New-\w+|Test-\w+)\b/gi, className: 'keyword' },
        { pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*/g, className: 'variable' },
        { pattern: /-[a-zA-Z][a-zA-Z0-9]*/g, className: 'builtin' },
        { pattern: /'([^'\\]|\\.)*'/g, className: 'string' },
        { pattern: /"([^"\\]|\\.)*"/g, className: 'string' },
        { pattern: /\b\d+\.?\d*\b/g, className: 'number' },
        { pattern: /[+\-*/%=<>!&|^~?:]+/g, className: 'operator' },
        { pattern: /[{}()\[\];,.:]/g, className: 'punctuation' },
      ],

      json: [
        { pattern: /"[^"]*"\s*:/g, className: 'property' },
        { pattern: /:\s*"[^"]*"/g, className: 'string' },
        { pattern: /:\s*(true|false|null)\b/g, className: 'keyword' },
        { pattern: /:\s*\d+\.?\d*/g, className: 'number' },
        { pattern: /[{}()\[\];,.:]/g, className: 'punctuation' },
      ]
    };

    return basePatterns[language as keyof typeof basePatterns] || basePatterns.typescript;
  }

  private escapeHtml(text: string): string {
    // Limpiar el código de espacios innecesarios al inicio/final
    const cleanedText = text.trim();

    return cleanedText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
