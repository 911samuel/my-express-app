import express, { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import path from "path";

require('dotenv').config();

import blog from "./routes/blogs";
import user from "./routes/users";
import comment from "./routes/comments";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", user);
app.use("/blogs", blog);
app.use("/comments", comment);

export const testingDb = () => {
    const dbtest = process.env.TEST_MONGODB_URI;
    if (!dbtest) {
      console.log("Can not read mongoo string for testing");
      return;
    } else {
      mongoose
        .connect(dbtest)
        .then(() => {
          console.log("dataBase for testing successfully connected");
        })
        .catch((err: any) => {
          console.log("dataBase for testing failed to connect:", err);
        });
    }
  };

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong! Error: ${err.message}`);
});
export default app;