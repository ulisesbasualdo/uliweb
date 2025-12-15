const COLOR_TAG_NAME = '#FF2E88';
const COLOR_ATTR_NAME = '#00E5FF';
const COLOR_COMMENT = '#3D8BFF';
const COLOR_DOCTYPE = '#B026FF';

function wrap(color: string, text: string): string {
	return `<span style="color:${color}">${text}</span>`;
}

const LT = '&lt;';
const GT = '&gt;';
const COMMENT_OPEN = '&lt;!--';
const COMMENT_CLOSE = '--&gt;';

function findNextIndex(text: string, startIndex: number, needle: string): number {
	return text.indexOf(needle, startIndex);
}

function highlightTagInner(tagInner: string): string {
	// `tagInner` is the content between `&lt;` and `&gt;` (may include leading '/').
	let index = 0;

	let output = '';
	if (tagInner.startsWith('/')) {
		output += '/';
		index++;
	}

	// Handle `!DOCTYPE ...`
	if (tagInner.slice(index).toUpperCase().startsWith('!DOCTYPE')) {
		return output + wrap(COLOR_DOCTYPE, tagInner.slice(index));
	}

	const tagNameMatch = /^[A-Za-z][\w:-]*/.exec(tagInner.slice(index));
	if (tagNameMatch) {
		const tagName = tagNameMatch[0];
		output += wrap(COLOR_TAG_NAME, tagName);
		index += tagName.length;
	}

	const rest = tagInner.slice(index);
	// Highlight attribute names (including boolean attributes).
	// This regex only runs on the tag-inner substring, so it won't accidentally style our injected spans.
	const highlightedRest = rest.replaceAll(/\b([A-Za-z_:][\w:.-]*)(?=(\s*=)|\s|\/?$)/g, (full, attrName) => {
		// Avoid highlighting the tag name if it wasn't matched above
		return wrap(COLOR_ATTR_NAME, String(attrName));
	});

	return output + highlightedRest;
}

/**
 * Highlights HTML from an HTML-escaped input (expects entities like &lt; &gt; &quot; &#39;).
 * Keeps &lt;/&gt; entities untouched so bracket highlighting can handle them.
 */
export function highlightHtmlCode(escapedCode: string): string {
	if (escapedCode.length === 0) return '';

	let output = '';
	let i = 0;

	while (i < escapedCode.length) {
		// Comments: &lt;!-- ... --&gt;
		if (escapedCode.startsWith(COMMENT_OPEN, i)) {
			const endIndex = findNextIndex(escapedCode, i + COMMENT_OPEN.length, COMMENT_CLOSE);
			if (endIndex !== -1) {
				const fullComment = escapedCode.slice(i, endIndex + COMMENT_CLOSE.length);
				output += wrap(COLOR_COMMENT, fullComment);
				i = endIndex + COMMENT_CLOSE.length;
				continue;
			}
		}

		if (escapedCode.startsWith(LT, i)) {
			const endIndex = findNextIndex(escapedCode, i + LT.length, GT);
			if (endIndex !== -1) {
				const inner = escapedCode.slice(i + LT.length, endIndex);

				output += LT;
				output += highlightTagInner(inner);
				output += GT;

				i = endIndex + GT.length;
				continue;
			}
		}

		output += escapedCode[i];
		i++;
	}

	return output;
}
