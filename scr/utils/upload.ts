import path from 'path';
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { Request, Express } from 'express';
import { date } from 'joi';

const storage: StorageEngine = multer.diskStorage({
    destination: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
       cb(null, 'upload/');
    },  
    filename: function(req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        let ext = path.extname(file.originalname); 
        cb(null, file.fieldname + '-' + Date.now + ext);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req: Request, file: Express.Multer.File, callback: FileFilterCallback) {
        if (file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png') {    
            callback(null, true);
        } else {
            console.log('only jpg and png file supported')
            callback(null, false); 
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 }
});

export default upload;
