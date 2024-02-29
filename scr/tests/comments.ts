import request from "supertest";
import server from "../server"; 
import {authToken, userId} from './users'
import {blogId} from './blogs'

const mockComment = {
  content: "Test Comment Content"
};

it("POST /comment/:id/add should add a new comment", async () => {
  const response = await request(server)
    .post("/comment/:id/add") 
    .send(mockComment);
  expect(response.status).toBe(201);
  expect(response.body.message).toBe("Comment added successfully");
  expect(response.body.comment).toBeDefined();
});

it("PUT /comment/:commentId should update a comment", async () => {
  const response = await request(server)
    .put("/comment/:commentId") 
    .send({ content: "Updated Comment Content" });
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Comment updated successfully");
  expect(response.body.comment).toBeDefined();
});

it("DELETE /comment/:commentId should delete a comment", async () => {
  const response = await request(server)
    .delete("/comment/:commentId"); 
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Comment deleted successfully");
});
