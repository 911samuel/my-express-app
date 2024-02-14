import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';

mongoose.connect('mongodb://localhost:27017/test');
const db = mongoose.connection;

db.on('error', (err) => {
  console.log(err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

const app = express();
app.use(morgan('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
