import request from 'supertest';
import app from '../server'; // Assuming your server file is named server.ts

describe('Brand Routes', () => {
  it('should create a new brand', async () => {
    const res = await request(app)
      .post('/api/brands')
      .send({
        name: 'Test Brand',
        description: 'Test Description',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toEqual('Test Brand');
    expect(res.body.description).toEqual('Test Description');
  });

  it('should get all brands', async () => {
    const res = await request(app).get('/api/brands');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a specific brand by ID', async () => {
    const newBrand = await request(app)
      .post('/api/brands')
      .send({
        name: 'Test Brand 2',
        description: 'Test Description 2',
      });

    const res = await request(app).get(`/api/brands/${newBrand.body._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', newBrand.body._id);
    expect(res.body.name).toEqual('Test Brand 2');
    expect(res.body.description).toEqual('Test Description 2');
  });

  // Add tests for updating and deleting brands
});
