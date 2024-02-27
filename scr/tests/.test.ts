import mongoose from 'mongoose';
import request from 'supertest';
import server from '../server'; 

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect("mongodb+srv://samabayizera:Ganza4.rw@mybrand.im3cjmx.mongodb.net/");
});

afterEach(async () => {
  await mongoose.connection.close();
});

let app = server

describe('Brand CRUD operations', () => {

  it('GET /api/brand should return status 200', async () => {
    const res = await request(app).get('/api/brand');
    expect(res.status).toBe(200);
  });

  it('POST /api/brand should return status 201', async () => {
    const res = await request(app)
      .post('/api/brand')
      .send({ name: 'Test Brand', description: 'This is a test brand' });
    expect(res.status).toBe(201);
  });

  it('PUT /api/brand/:id should return status 200', async () => {
    const brandId = 'your_brand_id';
    const res = await request(app)
      .put(`/api/brand/${brandId}`)
      .send({ name: 'Updated Brand Name', description: 'Updated brand description' });
    expect(res.status).toBe(200);
  });

  it('DELETE /api/brand/:id should return status 200', async () => {
    const brandId = 'your_brand_id';
    const res = await request(app).delete(`/api/brand/${brandId}`);
    expect(res.status).toBe(200);
  });
});
