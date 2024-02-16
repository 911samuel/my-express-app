"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.update = exports.store = exports.show = exports.index = void 0;
const brand_1 = __importDefault(require("../testing/brand"));
const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield brand_1.default.find();
        res.json({ brands });
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred" });
    }
});
exports.index = index;
const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const brand = yield brand_1.default.findById(id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        res.json({ brand });
    }
    catch (error) {
        next(error);
    }
});
exports.show = show;
const store = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, destination, email, phoneNumber, age, description } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }
    try {
        const brand = new brand_1.default({
            name,
            destination,
            email,
            phoneNumber,
            age,
            description,
        });
        if (req.file) {
            brand.avatar = req.file.path;
        }
        const savedBrand = yield brand.save();
        res
            .status(201)
            .json({ message: "The brand was added successfully", brand: savedBrand });
    }
    catch (error) {
        res.status(500).json({ error: "Error on save the brand" });
    }
});
exports.store = store;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, destination, email, phoneNumber, age, description } = req.body;
    const brandId = req.params.id;
    try {
        const updatedBrand = yield brand_1.default.findByIdAndUpdate(brandId, { $set: { name, destination, email, phoneNumber, age, description } }, { new: true });
        if (!updatedBrand) {
            return res.status(404).json({ message: "Brand not found." });
        }
        res
            .status(200)
            .json({
            message: `The brand was updated successfully.`,
            brand: updatedBrand,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.update = update;
const deleteBrand = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const brandId = req.params.id;
    try {
        const deletedBrand = yield brand_1.default.findByIdAndDelete(brandId);
        if (!deletedBrand) {
            return res.status(404).json({ message: "Brand not found." });
        }
        res.status(200).json({ message: `The brand was deleted successfully.` });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBrand = deleteBrand;
