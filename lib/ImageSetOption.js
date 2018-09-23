"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _postcss = _interopRequireDefault(require("postcss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-useless-escape:"warn" */
const DPPX_TO_DPI = 96;

class ImageSetOption {
  constructor(textOption) {
    if (textOption) {
      this.dpi = ImageSetOption._extractResolution(textOption);
      this.url = ImageSetOption._extractImageUrl(textOption);
    }
  }

  getDppx() {
    return this.dpi / DPPX_TO_DPI;
  }

  setDppx(x) {
    this.dpi = x * DPPX_TO_DPI;
    return this;
  }

  setUrl(path) {
    this.url = path;
    return this;
  }

  getUrl() {
    return this.url;
  }

  toString(resolutionType = "dpi") {
    // dpi || dppx || x
    let resolution;

    if (resolutionType === "dpi") {
      resolution = this.dpi;
    } else {
      resolution = this.getDppx();
    }

    return `url('${this.url}') ${resolution + resolutionType}`;
  }

  static _extractImageUrl(imageSetOption) {
    const m = imageSetOption.match(/url\(['"]?([^)'"]+)['"]?\)/);

    if (m) {
      return m[1].trim();
    }

    throw new Error("Incorrect <image> value for <image-set-option>");
  }

  static _extractResolution(imageSetOption) {
    const l = _postcss.default.list.space(imageSetOption);

    if (l.length === 1) {
      return DPPX_TO_DPI;
    }

    const m = l[1].match(/^([0-9|\.]+)(dpi|x)$/);

    if (m) {
      return Math.floor(m[1] * (m[2] !== "x" || DPPX_TO_DPI));
    }

    throw new Error("Incorrect <resolution> value for <image-set-option>");
  }

}

exports.default = ImageSetOption;
module.exports = exports.default;