import { Highlighter } from './highlight.types';
import { highlightTsCode } from './languages/ts-highlight';
import { highlightHtmlCode } from './languages/html-highlighter';
import { highlightScssCode } from './languages/scss-highlighter';

const identityHighlighter: Highlighter = (escapedCode) => escapedCode;

function normalizeLanguage(language: string | null | undefined): string {
	return (language ?? '').trim().toLowerCase();
}

const HIGHLIGHTERS: Record<string, Highlighter> = {
	ts: highlightTsCode,
	typescript: highlightTsCode,
	js: highlightTsCode,
	javascript: highlightTsCode,

	html: highlightHtmlCode,
	scss: highlightScssCode,
	css: highlightScssCode,
	sass: highlightScssCode,
};

export function getHighlighter(language: string | null | undefined): Highlighter {
	return HIGHLIGHTERS[normalizeLanguage(language)] ?? identityHighlighter;
}

export function getSupportedLanguages(): string[] {
	return Object.keys(HIGHLIGHTERS);
}
