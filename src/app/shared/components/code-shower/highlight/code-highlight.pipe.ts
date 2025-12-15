import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { highlightBrackets } from './brackets-highlight';
import { getHighlighter } from './highlight-registry';

@Pipe({
	name: 'codeHighlight',
	standalone: true,
	pure: true,
})
export class CodeHighlightPipe implements PipeTransform {
	constructor(private readonly sanitizer: DomSanitizer) {}

	transform(value: unknown, language?: string | null): SafeHtml {
		if (value == null) return this.sanitizer.bypassSecurityTrustHtml('');

		const escapedCode = String(value);
		const highlighter = getHighlighter(language);

		const keywordHighlighted = highlighter(escapedCode);
		const bracketHighlighted = highlightBrackets(keywordHighlighted);

		return this.sanitizer.bypassSecurityTrustHtml(bracketHighlighted);
	}
}
