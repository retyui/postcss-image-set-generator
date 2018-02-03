# postcss-image-set-generator

[![npm](https://img.shields.io/npm/v/postcss-image-set-generator.svg)](https://www.npmjs.com/package/postcss-image-set-generator)
[![AppVeyor](https://img.shields.io/appveyor/ci/retyui/postcss-image-set-generator.svg?label=win)](https://ci.appveyor.com/project/retyui/postcss-image-set-generator)
[![Travis](https://img.shields.io/travis/retyui/postcss-image-set-generator.svg?label=unix)](https://travis-ci.org/retyui/postcss-image-set-generator)
[![Greenkeeper badge](https://badges.greenkeeper.io/retyui/postcss-image-set-generator.svg)](https://greenkeeper.io/)

<img src="https://pp.userapi.com/c639816/v639816614/29dff/vPg0nxoXBBM.jpg" width="444" alt="Logo postcss-image-set-generator">

## Example or [Demo](https://github.com/retyui/demo-modern-images-usage-css)
```css
/* Input */
i {
  backgroung-image: image-set(url(bg.webp) 196dpi); }

a {
  border-image: image-set(url(border.webp) 1.5x); }

dd {
  backgroung: #fff image-set(url(bg.webp) 1x, url(bg-lg.webp) 2x); /* skiped */ }

/* Output */
i {
  backgroung-image: image-set(url(bg@x1.webp) 1x, url(bg@1.5x.webp) 1.5x, url(bg.webp) 2x); }

a {
  border-image: image-set(url(border@x1.webp) 1x, url(border@.webp) 1.5x); }

dd {
  backgroung: #fff image-set(url(bg.webp) 1x, url(bg-lg.webp) 2x); /* skiped */ }
```

## About this plugin
This [plugin](https://github.com/retyui/postcss-image-set-generator) add postcss function for [`image-set`](https://drafts.csswg.org/css-images-3/#image-set-notation).

This function checks if only one argument was passed to it, it automatically makes thumbnails of the images according to the sizes previously set.

You must specify only one picture of the largest size and specify for which pixelity pixel it is used

## Install
### [Prerequisites](http://sharp.dimens.io/en/stable/install/#prerequisites)
- Node v4+
- C++11 compatible compiler such as gcc 4.8+, clang 3.0+ or MSVC 2013+
- [`node-gyp`](https://github.com/nodejs/node-gyp#installation) and its dependencies (includes Python)
```bash
npm install postcss-image-set-generator --save-dev
yarn add postcss-image-set-generator --dev
```

## Example
Demo how it work look on this repo [demo-modern-images-usage-css](https://github.com/retyui/demo-modern-images-usage-css)

## Usage

### Gulp

In Gulp you can use [gulp-postcss] with `postcss-image-set-generator` npm package.

```js
gulp.task('autoprefixer', function () {
    const postcss      = require('gulp-postcss');
    const sourcemaps   = require('gulp-sourcemaps');
    const generatoRrr  = require('postcss-image-set-generator');

    return gulp.src('./src/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ generatoRrr(/* options */) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dest'));
});
```
### Postcss Api
```js
const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const postcss     = require('postcss');
const generatoRrr = require('postcss-image-set-generator');

const options = {
	from: resolve(__dirname, './assets/css/style.css'),
	to: resolve(__dirname, './assets/css/style.dist.css')
};
const { from, to } = options;

postcss()
	.use(generatoRrr(/* options */))
	.process(readFileSync(from), options)
	.then(result => writeFileSync(to, result.css));
```
## Options

### `scales`
type : `Array`, default: `[1, 1.5, 2, 3]`

List supported scale images

### `suffix`
type : `String` , default: `@x`

Miniature images naming `<name><suffix><scale>.<ext>`

Example: `icon-star.webp` -> `icon-star@x2.webp`

### `resolutionType`
type: `String`, default: `x`

Available Values `dpi || dppx || x`

### [`loadPaths`](https://github.com/borodean/assets#loadpaths)
### [`relativeTo`](https://github.com/borodean/assets#relativeto)
