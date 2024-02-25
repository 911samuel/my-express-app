import { Request, Response, NextFunction } from 'express';
import mongoose from "mongoose";
import supertest from "supertest";
import server from "../server";

require('dotenv').config();

beforeEach(async () => await mongoose.connect("mongodb://localhost:27017/test"));

afterEach(async () => await mongoose.connection.close());

describe("GET /api/brand", function () {
  it("should return a list of brands", async function () {
    const response = await supertest(server).get("/api/brand");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    // Add more assertions as needed based on the response structure
  });
});

describe("GET /api/products/:id", () => {
  it("should return product details", async () => {
    const res = await supertest(server).get("/api/products/123");

    expect(res.status).toBe(200);
    // Add more assertions as needed based on the response structure
  });
});

describe("POST /api/products", () => {
  it("should create a product", async () => {
    const newProduct = {
      name: "New Product",
      price: 999,
      description: "New Product Description",
    };

    const res = await supertest(server).post("/api/products").send(newProduct);

    expect(res.status).toBe(201);
    // Add more assertions as needed based on the response structure
  });
});

describe("PUT /api/products/:id", () => {
  it("should update a product", async () => {
    const updatedProduct = {
      name: "Updated Product",
      price: 888,
      description: "Updated Product Description",
    };

    const res = await supertest(server)
      .patch("/api/products/123")
      .send(updatedProduct);

    expect(res.status).toBe(200);
    // Add more assertions as needed based on the response structure
  });
});

describe("DELETE /api/products/:id", () => {
  it("should delete a product", async () => {
    const res = await supertest(server).delete("/api/products/123");

    expect(res.status).toBe(200);
    // Add more assertions as needed based on the response structure
  });
});
