export interface Base64Image {
	imgFile: Buffer;
	imgType: string;
}
class Base64ToImage {
	getImageData(base64: string) {
		let splitData = base64.split(",");
		let imgType = null;
		if (splitData.length > 1) {
			imgType = splitData[0].split(";")[0].split("/")[1];
			switch (imgType) {
				case "jpeg":
					imgType = "jpg";
					break;
			}
			base64 = splitData[1];
		}
		let imageBuffer = Buffer.from(base64, "base64");
		return {
			imgFile: imageBuffer,
			imgType: imgType
		};
	}
}
export default new Base64ToImage();
