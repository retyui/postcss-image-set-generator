"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unescapeSequence = unescapeSequence;
exports.unescapeCss = unescapeCss;
exports.unquote = unquote;
exports.normalizeUrl = normalizeUrl;

function unescapeSequence(match, hex, char) {
  if (hex) {
    return String.fromCharCode(parseInt(hex, 16));
  }

  return char;
}

const R_ESCAPE = /\\(?:([0-9a-f]{1,6} ?)|(.))/gi;

function unescapeCss(string) {
  return string.replace(R_ESCAPE, unescapeSequence);
}

function unquote(string) {
  if (string[0] !== "'" && string[0] !== '"') {
    return string;
  }

  return string.slice(1, -1);
}

function normalizeUrl(path) {
  return unquote(unescapeCss(path));
}