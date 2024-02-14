"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.update = exports.store = exports.show = exports.index = void 0;
var brand_1 = require("../testing/brand");
var index = function (req, res, next) {
    brand_1.default.find(function (err, brands) {
        if (err)
            return next(err);
        req.brands = brands;
        next();
    });
};
exports.index = index;
var show = function (req, res, next) {
    var id = req.body.id || req.params.id;
    brand_1.default.findById(id, function (err, brand) {
        if (err)
            return next(err);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        req.brand = brand;
        next();
    });
};
exports.show = show;
var store = function (req, res, next) {
    var brand = new brand_1.default({
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    });
    brand.save()
        .then(function (data) {
        res.status(201).json(data);
    })
        .catch(function (error) {
        res.status(500).json({ error: "Error on save the brand" });
    });
};
exports.store = store;
var update = function (req, res, next) {
    var brandId = req.body.brandId;
    var updateData = {
        name: req.body.name,
        destination: req.body.destination,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        description: req.body.description
    };
    brand_1.default.findByIdAndUpdate(brandId, { $set: updateData }, { new: true })
        .then(function (data) {
        if (!data) {
            return res.status(404).json({ message: 'Brand not found.' });
        }
        else {
            res.status(200).json(data);
        }
    }).catch(next);
};
exports.update = update;
var deleteBrand = function (req, res, next) {
    var brandId = req.params.id;
    brand_1.default.findByIdAndDelete(brandId, function (err, brandDeleted) {
        if (err)
            return next(err);
        if (!brandDeleted) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully' });
    });
};
exports.deleteBrand = deleteBrand;
