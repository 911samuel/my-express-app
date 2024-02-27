import request from "supertest";
import server from "../server";
import mongoose, { set } from "mongoose";

describe("API Endpoints", () => {

  let authToken: string;
  let brandId: number;

  beforeAll(async () => {
    await mongoose.connect(
      "mongodb+srv://samabayizera:Ganza4.rw@mybrand.im3cjmx.mongodb.net/"
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('GET / should return "Hello, World!"', async () => {
    const response = await request(server).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, World!");
  });

  it("POST /api/register should register a user", async () => {
    const user = {
      firstname: "abayizera",
      lastname: "samuel",
      email: "abayizeraeaz1234567@gmailcom",
      role: "admin",
      password: "Ganza4.rw",
    };
    const response = await request(server).post("/api/register").send(user);
    expect(response.status).toBe(200);
  });

  it("POST /api/login should log in a user", async () => {
    const credentials = {
      email: "abayizeraeaz1234567@gmailcom",
      password: "Ganza4.rw",
    };
    const response = await request(server).post("/api/login").send(credentials);
    expect(response.status).toBe(200);
    authToken = response.body.token;
    expect(authToken).toBeTruthy();
  });

  it("POST /api/brand/store should create a new brand", async () => {
    let brand = {
      title: "online shopping",
      author: "admin",
      category: "fashion",
      description: "thank you",
      avatar: "../uploads/1709015366804.png",
    };
  
    const response = await request(server)
      .post("/api/brand/store")
      .send(brand)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(201);
  
    const { message, brand: createdBrand } = response.body;
    const brandWithId = { ...createdBrand, id: createdBrand._id };
    brandId =  createdBrand._id;
  });
  

  it("GET /api/brand should return a list of brands", async () => {
    const response = await request(server)
      .get("/api/brand")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  it("GET /api/brand/show/:id should return a specific brand", async () => {
    const response = await request(server)
      .get(`/api/brand/show/${brandId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  it("PUT /api/brand/update/:id  should update brand", async () => {
    let brand = {
      title: "online shopping",
      author: "admin",
      category: "fashion",
    };
    const response = await request(server)
      .put(`/api/brand/update/${brandId}`)
      .send(brand)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  it("DELETE /deleteBrand/:id should delete the specified brand", async () => {
    const response = await request(server)
      .delete(`/api/brand/deleteBrand/${brandId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });

  it("DELETE /deleteAll Brands should delete all brands", async () => {
    const response = await request(server)
      .delete("/api/brand/deleteAll")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toEqual(200);
  });
});
