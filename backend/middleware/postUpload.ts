import multer, { MulterError } from 'multer';

const storage = multer.memoryStorage();

const videoMimeTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/3gpp', 'video/3gpp2', 'video/x-matroska'];
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];


const postUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'video') {
            if (!videoMimeTypes.includes(file.mimetype)) {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'video'));
            }
            else {
                cb(null, true);
            }
        }
        else if (file.fieldname === 'images') {
            if (!imageMimeTypes.includes(file.mimetype)) {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'images'));
            }
            else {
                cb(null, true);
            }
        }
    }
}).fields([{ name: 'content' }, { name: 'video' }, { name: 'images' }, { name: 'poll' }]);

export default postUpload;