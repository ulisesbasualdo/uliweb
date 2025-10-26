import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, Signal, signal } from '@angular/core';

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

  processedCode: Signal<string> = computed(() => {
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
