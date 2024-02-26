import sharp from "sharp";


class FileService {
    public async validateBannerAspectRatio(buffer: Buffer) {
        const metadata = await sharp(buffer).metadata();
        if (!metadata.width || !metadata.height) throw new Error();
        const aspectRatio = metadata.width / metadata.height;
        return Math.abs(aspectRatio - 5) < 0.1;
    }
}

export default new FileService();