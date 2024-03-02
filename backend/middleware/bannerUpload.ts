import multer, { MulterError } from "multer";

const storage = multer.memoryStorage();

const bannerUpload = multer({
    storage,
    limits: { fileSize: 7 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!imageMimeTypes.includes(file.mimetype)) {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE'));
        }
        else {
            cb(null, true);
        }
    }
}).fields([{ name: 'banner' }]);

export default bannerUpload;