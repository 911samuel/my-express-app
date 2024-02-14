import express, { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';

const app = express();

app.use(express.json());

const uri: string = 'mongodb://localhost:27017/mydatabase';

const clientOptions: MongoClientOptions = {
};

MongoClient.connect(uri, clientOptions)
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('mydatabase');

    app.get('/data', async (req: Request, res: Response) => {
      const data = await db.collection('mycollection').find().toArray();
      res.json(data);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
