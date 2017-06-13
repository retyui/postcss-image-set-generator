import { parse, resolve } from 'path';

import Image from './Image';
import ImageSetOption from './ImageSetOption';
import Newer from './Newer';
import { normalizeUrl } from './helps';

export default class GeneratorMiniaures {

	constructor(proxyOptions, resolver) {
		this.options = proxyOptions;
		this.resolver = resolver;
	}

	generateImageSet(result) {
		return `image-set( ${result.map(e => e.toString(this.options.get('resolutionType'))).join(', ')} )`;
	}

	valueProcessing(imageSetOption) {
		const originalImageOption = new ImageSetOption(imageSetOption);

		return new Promise((resolveImgSet, rejectImgSet) => {
			const originImageUrl = normalizeUrl(originalImageOption.getUrl());

			this.resolver.getPath(originImageUrl) // find img in fs
				.catch(rejectImgSet)
				.then(origPath => {

					if (!origPath) {
						return;
					}

					const scales = this.options.get('scales');
					const maxScale = originalImageOption.getDppx() || Math.max(...scales);
					const originImage = new Image(origPath, originImageUrl, maxScale);
					const arrResizePromise = [];

					scales.filter(e => e <= maxScale).forEach(x => {

						if (x === maxScale) {
							arrResizePromise.push(Promise.resolve(originalImageOption));
							return;
						}

						const _parsed = parse(origPath);
						const newImgFileName = `${_parsed.name}${this.options.get('suffix')}${x}${_parsed.ext}`;
						const newImgFilePath = resolve(_parsed.dir, newImgFileName);

						arrResizePromise.push(new Promise((resolveFile, rejectFile) => {

							Newer.skipThisFile(origPath, newImgFilePath).then(skipThisFile => { // check miniature created?

								if (skipThisFile) { // file exist
									resolveFile(new ImageSetOption().setDppx(x).setUrl(originImage.getShortPath(newImgFileName)));
								} else {
									originImage.resizeImg(newImgFilePath, x) // created miniature
										.then(() => {
											resolveFile(new ImageSetOption().setDppx(x).setUrl(originImage.getShortPath(newImgFileName)));
										})
										.catch(rejectFile);
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
