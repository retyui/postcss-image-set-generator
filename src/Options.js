export default class Options {
  constructor(options) {
    this.default = options;
  }

  init(userOptions = {}) {
    this.customOptions = userOptions;

    let ref;
    if ((ref = this.customOptions.scale) !== undefined && Array.isArray(ref)) {
      ref.sort();
    }
  }

  get(key) {
    const option = this.customOptions ? this.customOptions[key] : undefined;
    if (option !== undefined) {
      return option;
    }
    return this.default[key];
  }

  getAll() {
    return Object.assign({}, this.default, this.customOptions);
  }
}
