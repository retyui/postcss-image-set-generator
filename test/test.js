'use strict';

var expect = require('chai').expect;
var postcss = require('postcss');
var generatorImgs = require('../dist/main');

var path = require('path');
var options = {
	from: path.resolve(__dirname, './src/style.css')
};

var test = function test(input, output, done, plOpt) {
	plOpt = plOpt || {};

	postcss(generatorImgs(plOpt)).process(input, options).then(function (result) {
		expect(result.css.replace(/[ \n]/g, '')).to.eql(output.replace(/[ \n]/g, ''));
		done();
	});
};

describe('postcss-image-set-generator', function () {

	describe('Parses the image-set', function () {
		var _output = 'i  {border-image: image-set(url(\'img/ok@x1.png\') 1x, url(\'img/ok@x1.5.png\') 1.5x, url(\'img/ok.png\') 2x); }';

		it('Double  quotes url("")', function (done) {
			var input = 'i { border-image: image-set(url("img/ok.png") 2x); }';

			test(input, _output, done);
		});

		it('Single  quotes url(\'\')', function (done) {
			var input = 'i { border-image: image-set(url(\'img/ok.png\') 2x); }';

			test(input, _output, done);
		});

		it('Without quotes url()', function (done) {
			var input = 'i { border-image: image-set(url(\'img/ok.png\') 2x); }';

			test(input, _output, done);
		});

		it('don\'t break if function image-set(url() x1, ...)  have multi options', function (done) {
			var input = 'i { border-image: image-set(url(\'img/ok.png\') 1x, url(\'img/ok@x2.png\') 2x); }';

			test(input, input, done);
		});
	});

	describe('Plugins options', function () {
		it('scales: [1,1.25]', function (done) {
			var input = 'i { border-image: image-set(url("img/ok.png") 2x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok@x1.png\') 1x, url(\'img/ok@x1.25.png\') 1.25x); }', done, {
				scales: [1, 1.25]
			});
		});

		it('scales: [1,1.25], suffix:\'__\'', function (done) {
			var input = 'i { border-image: image-set(url("img/ok.png") 2x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok__1.png\') 1x, url(\'img/ok__1.25.png\') 1.25x); }', done, {
				scales: [1, 1.25],
				suffix: '__'
			});
		});

		it('scales: [1,1.5], suffix:\'_@_\', resolutionType: \'dpi\'', function (done) {
			var input = 'i { border-image: image-set(url("img/ok.png") 2x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok_@_1.png\') 96dpi, url(\'img/ok_@_1.5.png\') 144dpi); }', done, {
				scales: [1, 1.5],
				suffix: '_@_',
				resolutionType: 'dpi'
			});
		});

		it('scales: [1,1.5], suffix:\'_@_\', resolutionType: \'dppx\'', function (done) {
			var input = 'i { border-image: image-set(url("img/ok.png") 2x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok_@_1.png\') 1dppx, url(\'img/ok_@_1.5.png\') 1.5dppx); }', done, {
				scales: [1, 1.5],
				suffix: '_@_',
				resolutionType: 'dppx'
			});
		});
	});

	describe('Image formats', function () {
		it('PNG', function (done) {
			var input = 'i { border-image: image-set(url(img/ok.png) 1.5x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok@x1.png\') 1x, url(\'img/ok.png\') 1.5x);}', done);
		});

		it('JPG', function (done) {
			var input = 'i { border-image: image-set(url(img/ok.jpg) 1.5x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok@x1.jpg\') 1x, url(\'img/ok.jpg\') 1.5x);}', done);
		});

		it('WEBP', function (done) {
			var input = 'i { border-image: image-set(url(img/ok.webp) 1.5x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok@x1.webp\') 1x, url(\'img/ok.webp\') 1.5x);}', done);
		});

		it('GIF', function (done) {
			var input = 'i { border-image: image-set(url(img/ok.gif) 1.5x); }';

			test(input, 'i { border-image: image-set(url(\'img/ok@x1.gif\') 1x, url(\'img/ok.gif\') 1.5x);}', done);
		});
	});
});
