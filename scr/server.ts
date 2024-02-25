import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

require('dotenv').config();

import BrandRoute from "./routes/brand";
import UserRoute from "./routes/auth";
import commentRoute from "./routes/commentsRoutes";

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/brand", BrandRoute);
app.use("/api", UserRoute);
app.use("/api", commentRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong! Error: ${err.message}`);
});

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

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

export  default server;
