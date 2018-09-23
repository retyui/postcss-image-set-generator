import Assets from "assets";
import path from "path";

export default class Resolver {
  constructor(options) {
    this.options = options;
    this.resolver = new Assets(options);
  }

  postcss(css) {
    let inputDir;
    if (css.source.input.file) {
      inputDir = path.dirname(css.source.input.file);

      this.resolver.options.loadPaths = this.resolver.options.loadPaths || [];
      this.resolver.options.loadPaths.unshift(inputDir);

      if (this.options.relative === true) {
        this.resolver.options.relativeTo = inputDir;
      }
    }

    if (typeof this.options.relative === "string") {
      this.resolver.options.relativeTo = this.options.relative;
    }
  }

  getPath(normalizedPath) {
    return this.resolver.path(normalizedPath);
  }
}
