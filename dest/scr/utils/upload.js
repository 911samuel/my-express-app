"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        let ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + Date.now + ext);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/png') {
            callback(null, true);
        }
        else {
            console.log('only jpg and png file supported');
            callback(null, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 2 }
});
exports.default = upload;
