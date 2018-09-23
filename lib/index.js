"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postcssImageSetGenerator = postcssImageSetGenerator;
exports.default = void 0;

var _GeneratorMiniatures = _interopRequireDefault(require("./GeneratorMiniatures"));

var _Options = _interopRequireDefault(require("./Options"));

var _Resolver = _interopRequireDefault(require("./Resolver"));

var _postcss = _interopRequireDefault(require("postcss"));

var _postcssFunctions = _interopRequireDefault(require("postcss-functions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint no-console:"warn" */
const proxyOptions = new _Options.default({
  // plugins options
  scales: [1, 1.5, 2, 3],
  suffix: "@x",
  resolutionType: "x",
  // dpi || dppx || x
  // Assets options https://github.com/borodean/assets#options
  relative: false
});

function postcssImageSetGenerator(options) {
  proxyOptions.init(options);
  const resolver = new _Resolver.default(proxyOptions.getAll());
  return (0, _postcss.default)().use(resolver.postcss.bind(resolver)).use((0, _postcssFunctions.default)({
    functions: {
      "image-set": function resolve(...imageSetOptions) {
        if (imageSetOptions.length === 1 && imageSetOptions[0]) {
          const gm = new _GeneratorMiniatures.default(proxyOptions, resolver);
          return gm.valueProcessing(imageSetOptions[0]).catch(e => {
            console.warn("[postcss-image-set-generator]: ", e);
            return Promise.resolve(`image-set(${imageSetOptions.join(", ")})`);
          });
        }

        return `image-set(${imageSetOptions.join(", ")})`;
      }
    }
  }));
}

var _default = _postcss.default.plugin("postcss-image-set-generator", postcssImageSetGenerator);

exports.default = _default;