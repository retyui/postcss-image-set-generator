export function unescapeSequence(match, hex, char) {
	if (hex) {
		return String.fromCharCode(parseInt(hex, 16));
	}
	return char;
}

const R_ESCAPE = /\\(?:([0-9a-f]{1,6} ?)|(.))/gi;
export function unescapeCss(string) {
	return string.replace(R_ESCAPE, unescapeSequence);
}

export function unquote(string) {
	if (string[0] !== '\'' && string[0] !== '"') {
		return string;
	}
	return string.slice(1, -1);
}

export function normalizeUrl(path) {
	return unquote(unescapeCss(path));
}
