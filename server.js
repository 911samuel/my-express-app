"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
mongoose_1.default.connect('mongodb://localhost:27017/test');
const db = mongoose_1.default.connection;
db.on('error', (err) => {
    console.log(err);
});
db.once('open', () => {
    console.log('Connected to MongoDB');
});
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
