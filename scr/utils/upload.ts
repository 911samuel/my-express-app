import path from 'path';
import multer, { StorageEngine } from 'multer';
import { Request, Express } from 'express';
import fs from 'fs';

const uploadDir = './uploads/'; 
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage: StorageEngine = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb) {
        cb(null, uploadDir); 
    },
    filename: function (req: Request, file: Express.Multer.File, cb) {
        let ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); 
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            callback(null, true);
        } else {
            console.log('only jpg and png file supported')
            callback(null, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 }
});

export default upload;
