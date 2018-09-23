"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assets = _interopRequireDefault(require("assets"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Resolver {
  constructor(options) {
    this.options = options;
    this.resolver = new _assets.default(options);
  }

  postcss(css) {
    let inputDir;

    if (css.source.input.file) {
      inputDir = _path.default.dirname(css.source.input.file);
      this.resolver.options.loadPaths = this.resolver.options.loadPaths || [];
      this.resolver.options.loadPaths.unshift(inputDir);

      if (this.options.relative === true) {
        this.resolver.options.relativeTo = inputDir;
      }
    }

    if (typeof this.options.relative === 'string') {
      this.resolver.options.relativeTo = this.options.relative;
    }
  }

  getPath(normalizedPath) {
    return this.resolver.path(normalizedPath);
  }

}

exports.default = Resolver;
module.exports = exports.default;