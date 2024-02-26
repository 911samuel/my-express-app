"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = __importDefault(require("../controllers/commentController"));
const isUser_1 = __importDefault(require("../middlewares/isUser"));
const router = express_1.default.Router();
router.post('/comments/:id', isUser_1.default, commentController_1.default.addComment);
exports.default = router;
