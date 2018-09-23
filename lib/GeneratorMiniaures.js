"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _Image = _interopRequireDefault(require("./Image"));

var _ImageSetOption = _interopRequireDefault(require("./ImageSetOption"));

var _Newer = _interopRequireDefault(require("./Newer"));

var _helps = require("./helps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GeneratorMiniaures {
  constructor(proxyOptions, resolver) {
    this.options = proxyOptions;
    this.resolver = resolver;
  }

  generateImageSet(result) {
    return `image-set( ${result.map(e => e.toString(this.options.get('resolutionType'))).join(', ')} )`;
  }

  valueProcessing(imageSetOption) {
    const originalImageOption = new _ImageSetOption.default(imageSetOption);
    return new Promise((resolveImgSet, rejectImgSet) => {
      const originImageUrl = (0, _helps.normalizeUrl)(originalImageOption.getUrl());
      this.resolver.getPath(originImageUrl) // find img in fs
      .catch(rejectImgSet).then(origPath => {
        if (!origPath) {
          return;
        }

        const scales = this.options.get('scales');
        const maxScale = originalImageOption.getDppx() || Math.max(...scales);
        const originImage = new _Image.default(origPath, originImageUrl, maxScale);
        const arrResizePromise = [];
        scales.filter(e => e <= maxScale).forEach(x => {
          if (x === maxScale) {
            arrResizePromise.push(Promise.resolve(originalImageOption));
            return;
          }

          const _parsed = (0, _path.parse)(origPath);

          const newImgFileName = `${_parsed.name}${this.options.get('suffix')}${x}${_parsed.ext}`;
          const newImgFilePath = (0, _path.resolve)(_parsed.dir, newImgFileName);
          arrResizePromise.push(new Promise((resolveFile, rejectFile) => {
            _Newer.default.skipThisFile(origPath, newImgFilePath).then(skipThisFile => {
              // check miniature created?
              if (skipThisFile) {
                // file exist
                resolveFile(new _ImageSetOption.default().setDppx(x).setUrl(originImage.getShortPath(newImgFileName)));
              } else {
                originImage.resizeImg(newImgFilePath, x) // created miniature
                .then(() => {
                  resolveFile(new _ImageSetOption.default().setDppx(x).setUrl(originImage.getShortPath(newImgFileName)));
                }).catch(rejectFile);
              }
            });
          }));
        });
        return Promise.all(arrResizePromise).then(result => {
          resolveImgSet(this.generateImageSet(result)); // generate image-set(...)
        }).catch(rejectImgSet);
      });
    });
  }

}

exports.default = GeneratorMiniaures;
module.exports = exports.default;