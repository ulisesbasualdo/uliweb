export type BracketKind = 'paren' | 'brace' | 'bracket' | 'angle';

type BracketStackItem = {
	bracketKind: BracketKind;
	color: string;
};

type HighlightContext = {
	bracketStack: BracketStackItem[];
	isInsideHtmlTag: boolean;
	isInsideSingleQuotes: boolean;
	isInsideDoubleQuotes: boolean;
	singleQuoteColor: string | null;
	doubleQuoteColor: string | null;
};

type HandleResult = {
	outputSegment: string;
	nextIndex: number;
} | null;

const BRACKET_COLOR_PALETTES: Record<BracketKind, string[]> = {
	// Keep palette aligned with ts-highlight neon vibe
	paren: ['#00E5FF', '#FF2E88', '#00FF9C', '#FFE66D', '#B026FF', '#FF9F1C'],
	brace: ['#00FF9C', '#3D8BFF', '#FF2E88', '#FFE66D', '#00E5FF', '#B026FF'],
	bracket: ['#3D8BFF', '#2DE2E6', '#FF2E88', '#FFE66D', '#00FF9C', '#FF9F1C'],
	angle: ['#2DE2E6', '#00E5FF', '#B026FF', '#FFE66D', '#3D8BFF', '#FF2E88'],
};

const QUOTE_COLOR_PALETTE = ['#FF9F1C', '#FFE66D', '#2DE2E6', '#FF2E88', '#00E5FF', '#00FF9C'];

const DOUBLE_QUOTE_ENTITY = '&quot;';
const SINGLE_QUOTE_ENTITY = '&#39;';
const LESS_THAN_ENTITY = '&lt;';
const GREATER_THAN_ENTITY = '&gt;';

function getBracketColorForDepth(bracketKind: BracketKind, nestingDepth: number): string {
	const palette = BRACKET_COLOR_PALETTES[bracketKind];
	return palette[nestingDepth % palette.length];
}

function getQuoteColorForDepth(nestingDepth: number): string {
	return QUOTE_COLOR_PALETTE[nestingDepth % QUOTE_COLOR_PALETTE.length];
}

function wrapWithColor(color: string, text: string): string {
	return `<span style="color:${color}">${text}</span>`;
}

function isEscapedWithBackslash(text: string, startIndex: number): boolean {
	let currentIndex = startIndex - 1;
	let backslashCount = 0;
	while (currentIndex >= 0 && text[currentIndex] === '\\') {
		backslashCount++;
		currentIndex--;
	}
	return backslashCount % 2 === 1;
}

function startsWithSubstringAt(text: string, startIndex: number, substring: string): boolean {
	return text.startsWith(substring, startIndex);
}

function getOpeningBracketKind(character: string): BracketKind | null {
	if (character === '(') return 'paren';
	if (character === '{') return 'brace';
	if (character === '[') return 'bracket';
	if (character === '<') return 'angle';
	return null;
}

function getClosingBracketKind(character: string): BracketKind | null {
	if (character === ')') return 'paren';
	if (character === '}') return 'brace';
	if (character === ']') return 'bracket';
	if (character === '>') return 'angle';
	return null;
}

function createInitialContext(): HighlightContext {
	return {
		bracketStack: [],
		isInsideHtmlTag: false,
		isInsideSingleQuotes: false,
		isInsideDoubleQuotes: false,
		singleQuoteColor: null,
		doubleQuoteColor: null,
	};
}

function isInsideAnyQuotes(context: HighlightContext): boolean {
	return context.isInsideSingleQuotes || context.isInsideDoubleQuotes;
}

function handleHtmlTag(text: string, startIndex: number, context: HighlightContext): HandleResult {
	if (isInsideAnyQuotes(context)) return null;

	const currentCharacter = text[startIndex];
	if (context.isInsideHtmlTag) {
		context.isInsideHtmlTag = currentCharacter !== '>';
		return { outputSegment: currentCharacter, nextIndex: startIndex + 1 };
	}

	if (currentCharacter === '<') {
		context.isInsideHtmlTag = true;
		return { outputSegment: currentCharacter, nextIndex: startIndex + 1 };
	}

	return null;
}

function toggleDoubleQuote(context: HighlightContext): string {
	if (!context.isInsideDoubleQuotes) {
		context.isInsideDoubleQuotes = true;
		context.doubleQuoteColor = getQuoteColorForDepth(context.bracketStack.length);
		return wrapWithColor(context.doubleQuoteColor, DOUBLE_QUOTE_ENTITY);
	}

	const quoteColor = context.doubleQuoteColor ?? getQuoteColorForDepth(context.bracketStack.length);
	context.isInsideDoubleQuotes = false;
	context.doubleQuoteColor = null;
	return wrapWithColor(quoteColor, DOUBLE_QUOTE_ENTITY);
}

function toggleSingleQuote(context: HighlightContext): string {
	if (!context.isInsideSingleQuotes) {
		context.isInsideSingleQuotes = true;
		context.singleQuoteColor = getQuoteColorForDepth(context.bracketStack.length);
		return wrapWithColor(context.singleQuoteColor, SINGLE_QUOTE_ENTITY);
	}

	const quoteColor = context.singleQuoteColor ?? getQuoteColorForDepth(context.bracketStack.length);
	context.isInsideSingleQuotes = false;
	context.singleQuoteColor = null;
	return wrapWithColor(quoteColor, SINGLE_QUOTE_ENTITY);
}

function handleQuoteEntities(text: string, startIndex: number, context: HighlightContext): HandleResult {
	if (startsWithSubstringAt(text, startIndex, DOUBLE_QUOTE_ENTITY) && !isEscapedWithBackslash(text, startIndex)) {
		if (context.isInsideSingleQuotes) return null;
		return { outputSegment: toggleDoubleQuote(context), nextIndex: startIndex + DOUBLE_QUOTE_ENTITY.length };
	}

	if (startsWithSubstringAt(text, startIndex, SINGLE_QUOTE_ENTITY) && !isEscapedWithBackslash(text, startIndex)) {
		if (context.isInsideDoubleQuotes) return null;
		return { outputSegment: toggleSingleQuote(context), nextIndex: startIndex + SINGLE_QUOTE_ENTITY.length };
	}

	return null;
}

function pushBracket(bracketKind: BracketKind, context: HighlightContext, textToWrap: string): string {
	const color = getBracketColorForDepth(bracketKind, context.bracketStack.length);
	context.bracketStack.push({ bracketKind, color });
	return wrapWithColor(color, textToWrap);
}

function popBracket(fallbackKind: BracketKind, context: HighlightContext, textToWrap: string): string {
	const topItem = context.bracketStack.at(-1);
	const fallbackDepth = Math.max(context.bracketStack.length - 1, 0);
	const color = topItem?.color ?? getBracketColorForDepth(fallbackKind, fallbackDepth);
	if (context.bracketStack.length > 0) context.bracketStack.pop();
	return wrapWithColor(color, textToWrap);
}

function handleAngleBracketEntities(text: string, startIndex: number, context: HighlightContext): HandleResult {
	if (isInsideAnyQuotes(context)) return null;

	if (startsWithSubstringAt(text, startIndex, LESS_THAN_ENTITY)) {
		return { outputSegment: pushBracket('angle', context, LESS_THAN_ENTITY), nextIndex: startIndex + LESS_THAN_ENTITY.length };
	}

	if (startsWithSubstringAt(text, startIndex, GREATER_THAN_ENTITY)) {
		return { outputSegment: popBracket('angle', context, GREATER_THAN_ENTITY), nextIndex: startIndex + GREATER_THAN_ENTITY.length };
	}

	return null;
}

function handleBracketCharacters(text: string, startIndex: number, context: HighlightContext): HandleResult {
	if (isInsideAnyQuotes(context)) return null;

	const currentCharacter = text[startIndex];
	const openingBracketKind = getOpeningBracketKind(currentCharacter);
	if (openingBracketKind) {
		return { outputSegment: pushBracket(openingBracketKind, context, currentCharacter), nextIndex: startIndex + 1 };
	}

	const closingBracketKind = getClosingBracketKind(currentCharacter);
	if (closingBracketKind) {
		return { outputSegment: popBracket(closingBracketKind, context, currentCharacter), nextIndex: startIndex + 1 };
	}

	return null;
}

/**
 * Highlights brackets/quotes by nesting depth.
 * IMPORTANT: This is designed to run AFTER keyword highlighting.
 * It will skip any HTML tags (e.g. <span ...>) already present in the string.
 */
export function highlightBrackets(input: string): string {
	if (input.length === 0) return '';

	const context = createInitialContext();
	let output = '';
	let currentIndex = 0;

	while (currentIndex < input.length) {
		const htmlTagResult = handleHtmlTag(input, currentIndex, context);
		if (htmlTagResult) {
			output += htmlTagResult.outputSegment;
			currentIndex = htmlTagResult.nextIndex;
			continue;
		}

		const quoteResult = handleQuoteEntities(input, currentIndex, context);
		if (quoteResult) {
			output += quoteResult.outputSegment;
			currentIndex = quoteResult.nextIndex;
			continue;
		}

		const angleEntityResult = handleAngleBracketEntities(input, currentIndex, context);
		if (angleEntityResult) {
			output += angleEntityResult.outputSegment;
			currentIndex = angleEntityResult.nextIndex;
			continue;
		}

		const bracketCharacterResult = handleBracketCharacters(input, currentIndex, context);
		if (bracketCharacterResult) {
			output += bracketCharacterResult.outputSegment;
			currentIndex = bracketCharacterResult.nextIndex;
			continue;
		}

		output += input[currentIndex];
		currentIndex++;
	}

	return output;
}
