import path from 'path';
import multer, { StorageEngine } from 'multer';
import { Request, Express } from 'express';

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, 'uploads'); 
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); 
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'image/jpg') {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 }
});

export default upload;
