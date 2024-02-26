import multer, { MulterError } from 'multer';

const storage = multer.memoryStorage();

const createChannel = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/3gpp', 'video/3gpp2', 'video/x-matroska'];
        const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (file.fieldname === 'banner') {
            if (!imageMimeTypes.includes(file.mimetype)) {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'banner'));
            }
            else {
                cb(null, true);
            }
        }
        else if (file.fieldname === 'profileVideo') {
            if (!videoMimeTypes.includes(file.mimetype)) {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'profileVideo'));
            }
            else {
                cb(null, true);
            }
        }
    }
}).fields([{ name: 'banner' }, { name: 'profileVideo' }, { name: 'description' }, { name: 'subscriptionPrice' }]);

export default createChannel;