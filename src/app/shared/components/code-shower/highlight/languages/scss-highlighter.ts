const COLOR_AT_RULE = '#00E5FF';
const COLOR_VARIABLE = '#00FF9C';
const COLOR_NUMBER = '#FFE66D';
const COLOR_HEX = '#FF2E88';
const COLOR_COMMENT = '#3D8BFF';
const COLOR_BOOLEAN = '#FF9F1C';

function wrap(color: string, text: string): string {
	return `<span style="color:${color}">${text}</span>`;
}

type HandleResult = {
	outputSegment: string;
	nextIndex: number;
} | null;

function isDigit(ch: string | undefined): boolean {
	return ch != null && ch >= '0' && ch <= '9';
}

function isAlpha(ch: string | undefined): boolean {
	if (ch == null) return false;
	const lower = ch.toLowerCase();
	return lower >= 'a' && lower <= 'z';
}

function isWordChar(ch: string | undefined): boolean {
	return isAlpha(ch) || isDigit(ch) || ch === '_' || ch === '-';
}

function isHexDigit(ch: string | undefined): boolean {
	if (ch == null) return false;
	return (
		(ch >= '0' && ch <= '9') ||
		(ch >= 'a' && ch <= 'f') ||
		(ch >= 'A' && ch <= 'F')
	);
}

function isUnitChar(ch: string | undefined): boolean {
	return isAlpha(ch) || ch === '%';
}

function handleBlockComment(text: string, startIndex: number): HandleResult {
	if (text[startIndex] !== '/' || text[startIndex + 1] !== '*') return null;
	const endIndex = text.indexOf('*/', startIndex + 2);
	if (endIndex === -1) return null;
	const comment = text.slice(startIndex, endIndex + 2);
	return { outputSegment: wrap(COLOR_COMMENT, comment), nextIndex: endIndex + 2 };
}

function handleLineComment(text: string, startIndex: number): HandleResult {
	if (text[startIndex] !== '/' || text[startIndex + 1] !== '/') return null;
	const endIndex = text.indexOf('\n', startIndex + 2);
	const comment = endIndex === -1 ? text.slice(startIndex) : text.slice(startIndex, endIndex);
	return {
		outputSegment: wrap(COLOR_COMMENT, comment),
		nextIndex: endIndex === -1 ? text.length : endIndex,
	};
}

function readWord(text: string, startIndex: number): number {
	let i = startIndex;
	while (i < text.length && isWordChar(text[i])) i++;
	return i;
}

function handleVariable(text: string, startIndex: number): HandleResult {
	if (text[startIndex] !== '$' || !isWordChar(text[startIndex + 1])) return null;
	const endIndex = readWord(text, startIndex + 1);
	return { outputSegment: wrap(COLOR_VARIABLE, text.slice(startIndex, endIndex)), nextIndex: endIndex };
}

function handleAtRule(text: string, startIndex: number): HandleResult {
	if (text[startIndex] !== '@' || !isWordChar(text[startIndex + 1])) return null;
	const endIndex = readWord(text, startIndex + 1);
	return { outputSegment: wrap(COLOR_AT_RULE, text.slice(startIndex, endIndex)), nextIndex: endIndex };
}

function handleHexColor(text: string, startIndex: number): HandleResult {
	if (text[startIndex] !== '#' || !isHexDigit(text[startIndex + 1])) return null;
	let i = startIndex + 1;
	while (i < text.length && isHexDigit(text[i]) && i - (startIndex + 1) < 8) i++;
	const length = i - (startIndex + 1);
	if (length !== 3 && length !== 4 && length !== 6 && length !== 8) return null;
	return { outputSegment: wrap(COLOR_HEX, text.slice(startIndex, i)), nextIndex: i };
}

function handleNumber(text: string, startIndex: number): HandleResult {
	if (!isDigit(text[startIndex])) return null;

	let i = startIndex;
	while (i < text.length && isDigit(text[i])) i++;
	if (text[i] === '.' && isDigit(text[i + 1])) {
		i++; // '.'
		while (i < text.length && isDigit(text[i])) i++;
	}

	let j = i;
	while (j < text.length && isUnitChar(text[j])) j++;

	return { outputSegment: wrap(COLOR_NUMBER, text.slice(startIndex, j)), nextIndex: j };
}

function handleBooleanOrNull(text: string, startIndex: number): HandleResult {
	if (!isAlpha(text[startIndex])) return null;
	const endIndex = readWord(text, startIndex);
	const word = text.slice(startIndex, endIndex);
	if (word !== 'true' && word !== 'false' && word !== 'null') return null;
	return { outputSegment: wrap(COLOR_BOOLEAN, word), nextIndex: endIndex };
}

const HANDLERS: Array<(text: string, startIndex: number) => HandleResult> = [
	handleBlockComment,
	handleLineComment,
	handleVariable,
	handleAtRule,
	handleHexColor,
	handleNumber,
	handleBooleanOrNull,
];

/**
 * Highlights SCSS from an HTML-escaped input.
 * Keeps quote entities untouched so bracket highlighting can handle them.
 */
export function highlightScssCode(escapedCode: string): string {
	if (escapedCode.length === 0) return '';

	let output = '';
	let currentIndex = 0;

	while (currentIndex < escapedCode.length) {
		let handled = false;
		for (const handler of HANDLERS) {
			const result = handler(escapedCode, currentIndex);
			if (!result) continue;
			output += result.outputSegment;
			currentIndex = result.nextIndex;
			handled = true;
			break;
		}

		if (handled) continue;
		output += escapedCode[currentIndex];
		currentIndex++;
	}

	return output;
}
