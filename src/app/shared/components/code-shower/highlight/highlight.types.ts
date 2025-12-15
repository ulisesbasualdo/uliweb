export type CodeLanguage =
	| 'ts'
	| 'typescript'
	| 'js'
	| 'javascript'
	| 'html'
	| 'scss'
	| 'css'
	| (string & { __otherLanguage?: never });

/**
 * A highlighter receives HTML-escaped code and returns an HTML string
 * containing `<span ...>` wrappers.
 */
export type Highlighter = (escapedCode: string) => string;
