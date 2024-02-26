"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BrandController = __importStar(require("../controllers/brandController"));
const upload_1 = __importDefault(require("../middlewares/upload"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const validation_1 = require("../middlewares/validation");
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = (0, express_1.Router)();
router.get('/', authenticate_1.default, isAdmin_1.default, BrandController.index);
router.get('/show/:id', authenticate_1.default, isAdmin_1.default, BrandController.show);
router.post('/store', authenticate_1.default, isAdmin_1.default, validation_1.storeValidationRules, upload_1.default.single('avatar'), BrandController.store);
router.put('/update/:id', authenticate_1.default, isAdmin_1.default, validation_1.updateValidationRules, BrandController.update);
router.delete('/deleteBrand/:id', authenticate_1.default, authenticate_1.default, BrandController.deleteBrand);
router.delete('/deleteAll', authenticate_1.default, isAdmin_1.default, BrandController.deleteAll);
exports.default = router;
