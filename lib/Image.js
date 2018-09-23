"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sharp = _interopRequireDefault(require("sharp"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Image {
  constructor(fsPath, urlPath, maxScale) {
    this.fsPath = fsPath;
    this.urlPath = urlPath;
    this.maxScale = maxScale;
  }

  getShortPath(newFileName) {
    return `${(0, _path.dirname)(this.urlPath)}/${newFileName}`;
  }

  resizeImg(newImpPath, scale) {
    return new Promise((resolve, reject) => {
      const image = (0, _sharp.default)(this.fsPath);
      image.metadata().then(metadata => {
        const pxToMaxResolution = metadata.width / this.maxScale;
        return image.resize(Math.round(pxToMaxResolution * scale)).toFile(newImpPath).then(resolve).catch(reject);
      }).catch(reject);
    });
  }

}

exports.default = Image;
module.exports = exports.default;