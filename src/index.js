/* eslint no-console:"warn" */
import GeneratorMiniatures from "./GeneratorMiniatures";
import Options from "./Options";
import Resolver from "./Resolver";
import postcss from "postcss";
import postcssFunctions from "postcss-functions";

const proxyOptions = new Options({
  // plugins options
  scales: [1, 1.5, 2, 3],
  suffix: "@x",
  resolutionType: "x", // dpi || dppx || x
  // Assets options https://github.com/borodean/assets#options
  relative: false
});

export function postcssImageSetGenerator(options) {
  proxyOptions.init(options);
  const resolver = new Resolver(proxyOptions.getAll());
  return postcss()
    .use(resolver.postcss.bind(resolver))
    .use(
      postcssFunctions({
        functions: {
          "image-set": function resolve(...imageSetOptions) {
            if (imageSetOptions.length === 1 && imageSetOptions[0]) {
              const gm = new GeneratorMiniatures(proxyOptions, resolver);
              return gm.valueProcessing(imageSetOptions[0]).catch(e => {
                console.warn("[postcss-image-set-generator]: ", e);
                return Promise.resolve(
                  `image-set(${imageSetOptions.join(", ")})`
                );
              });
            }
            return `image-set(${imageSetOptions.join(", ")})`;
          }
        }
      })
    );
}

export default postcss.plugin(
  "postcss-image-set-generator",
  postcssImageSetGenerator
);
