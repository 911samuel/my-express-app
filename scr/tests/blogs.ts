import request from "supertest";
import server from "../server"; 
import {authToken, userId} from './users'

let blogId: number;

const mockBlog = {
    title: "Test Blog",
    author: "Test Author",
    category: "Test Category",
    description: "Test Description"
  };

  it("POST /blog/create should create a new blog", async () => {
    const response = await request(server)
      .post("/blog/create")
      .send(mockBlog);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("The blog was added successfully");
    expect(response.body.blog).toBeDefined();
    blogId = response.body._id;
  });

  it("PUT /user/:userId should update a user", async () => {
    const response = await request(server)
      .put(`/user/${userId}`) 
      .set("Authorization", `Bearer ${authToken}`)
      .send({ firstname: "UpdatedFirstname" }); 
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
    expect(response.body.user).toBeDefined();
  });
  
  it("DELETE /user/:userId should delete a user", async () => {
    const response = await request(server)
      .delete(`/user/${userId}`) 
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });
  
  it("DELETE /user should delete all users", async () => {
    const response = await request(server)
      .delete("/user")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("All users deleted successfully");
  });

  export {blogId}