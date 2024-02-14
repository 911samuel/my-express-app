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
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const uri = 'mongodb://localhost:27017/mydatabase';
const clientOptions = {};
mongodb_1.MongoClient.connect(uri, clientOptions)
    .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('mydatabase');
    app.get('/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield db.collection('mycollection').find().toArray();
        res.json(data);
    }));
})
    .catch(err => {
    console.error('Error connecting to MongoDB', err);
});
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
