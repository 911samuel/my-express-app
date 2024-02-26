"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
require('dotenv').config();
const brand_1 = __importDefault(require("./routes/brand"));
const auth_1 = __importDefault(require("./routes/auth"));
const commentsRoutes_1 = __importDefault(require("./routes/commentsRoutes"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
mongoose_1.default
    .connect("mongodb://localhost:27017/test")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.use("/api/brand", brand_1.default);
app.use("/api", auth_1.default);
app.use("/api", commentsRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`Something went wrong! Error: ${err.message}`);
});
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
process.on("SIGINT", () => {
    console.log("Server shutting down...");
    server.close(() => {
        console.log("Server stopped");
        process.exit(0);
    });
});
exports.default = server;
