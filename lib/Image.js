import Sharp from 'sharp';
import { dirname } from 'path';


export default class Image {
	constructor(fsPath, urlPath, maxScale) {
		this.fsPath = fsPath;
		this.urlPath = urlPath;
		this.maxScale = maxScale;
	}

	getShortPath(newFileName) {
		return `${dirname(this.urlPath)}/${newFileName}`;
	}

	resizeImg(newImpPath, scale) {
		return new Promise((resolve, reject) => {
			const image = Sharp(this.fsPath);
			image
				.metadata()
				.then(metadata => {
					const pxToMaxResolution = metadata.width / this.maxScale
					return image
						.resize(Math.round(pxToMaxResolution * scale))
						.toFile(newImpPath)
						.then(resolve)
						.catch(reject);
				})
				.catch(reject);
		});
	}
}
