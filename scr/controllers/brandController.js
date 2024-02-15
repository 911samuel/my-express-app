"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.update = exports.store = exports.show = exports.index = void 0;
const brand_1 = __importDefault(require("../testing/brand"));
const index = (req, res, next) => {
    brand_1.default.find()
        .then((response) => {
        res.json({ response });
    })
        .catch((error) => {
        res.status(500).json({ message: "An error occurred" });
    });
};
exports.index = index;
const show = (req, res, next) => {
    const id = req.params.id;
    brand_1.default.findById(id)
        .then((brand) => {
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.json({ brand });
    })
        .catch((error) => {
        next(error);
    });
};
exports.show = show;
const store = (req, res, next) => {
    const brand = new brand_1.default({
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    });
    brand.save()
        .then((savedBrand) => {
        res.status(201).json({ message: `The brand was added successfully.`, brand: savedBrand });
    })
        .catch((error) => {
        res.status(500).json({ error: "Error on save the brand" });
    });
};
exports.store = store;
const update = (req, res, next) => {
    const brandId = req.params.id;
    const updateData = {
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    };
    brand_1.default.findByIdAndUpdate(brandId, { $set: updateData }, { new: true })
        .then((updatedBrand) => {
        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found.' });
        }
        res.status(200).json({ message: `The brand was updated successfully.`, brand: updatedBrand });
    })
        .catch((error) => {
        next(error);
    });
};
exports.update = update;
const deleteBrand = (req, res, next) => {
    const brandId = req.params.id;
    brand_1.default.findByIdAndDelete(brandId)
        .then((deletedBrand) => {
        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found.' });
        }
        res.status(200).json({ message: `The brand was deleted successfully.` });
    })
        .catch((error) => {
        next(error);
    });
};
exports.deleteBrand = deleteBrand;
