import multer, { MulterError } from "multer";

const storage = multer.memoryStorage();

const profileVideoUpload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/3gpp', 'video/3gpp2', 'video/x-matroska'];
        if (!videoMimeTypes.includes(file.mimetype)) {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE'));
        }
        else {
            cb(null, true);
        }
    }
}).fields([{ name: 'profileVideo' }]);

export default profileVideoUpload;