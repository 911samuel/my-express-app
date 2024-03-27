import multer, { StorageEngine } from "multer";
import { Request, Express } from "express";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

const requiredEnvVars = ["CLOUDINARY_NAME", "API_KEY", "API_SECRET"];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing Cloudinary environment variable: ${varName}`);
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    console.log("Upload destination:", path.join(__dirname, "uploads"));
    cb(null, "uploads");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname);
    cb(null, randomString + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req: Request, file: Express.Multer.File, callback) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 2 }, 
}).single("imgUrl");

const uploadToCloudinary = async (
  file: Express.Multer.File
): Promise<string | Error> => {
  try {
    const result = await cloudinary.uploader.upload(file.path);
    console.log(
      "Image uploaded to Cloudinary successfully:",
      result.secure_url
    );
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

export { upload, uploadToCloudinary };
