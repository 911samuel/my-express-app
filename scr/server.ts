import express, { Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerOutPut from './documentation/swagger_output.json'

require('dotenv').config();

import blog from "./routes/blogs";
import user from "./routes/users";
import comment from "./routes/comments";

import mongoose, { ConnectOptions } from "mongoose";
import morgan from "morgan";

mongoose
  .connect(process.env.MYBRAND_MONGODB_URI || 'default_connection_string')
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", user
 /* 
#swagger.tags = ['USER']
*/
);
app.use("/blogs", blog
/* 
#swagger.tags = ['BLOG']
*/
);
app.use("/comments", comment
/* 
#swagger.tags = ['COMMENT']
*/
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutPut));

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

export default server;
