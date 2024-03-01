import request from "supertest";
import server from "../server";
import mongoose from "mongoose";

describe("API Endpoints", () => {
  let blogId: number;
  let authToken: string;
  let userId: number;

  const mockBlog = {
    title: "Test Blog",
    author: "Test Author",
    category: "Test Category",
    description: "Test Description",
    imgUrl: '/home/sam/Pictures/Screenshots/Screenshot from 2024-02-23 00-00-41.png'
  };

  const mockUser = {
    firstname: "Test",
    lastname: "User",
    username: "testuser1234567890",
    email: "test@example.com",
    password: "Test1234",
    role: "admin",
    profile: "/home/sam/Pictures/Screenshots/Screenshot from 2024-02-23 00-00-41.png",
  };

  const mockComment = {
    content: "Test Comment Content",
  };

  // beforeAll(async () => {
  //   await mongoose.connect(
  //     "mongodb+srv://samabayizera:Ganza4.rw@mybrand.im3cjmx.mongodb.net/testing"
  //   );
  // });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it("POST /users/signUp should register a user", async () => {
    const response = await request(server)
    .post("/users/signUp")
    .send(mockUser);
    expect(response.status).toBe(200);
  });

  it("POST /users/signIn should log in a user", async () => {
    const response = await request(server)
      .post("/users/signIn")
      .send({ email: mockUser.email, password: mockUser.password });
    expect(response.status).toBe(200);
    authToken = response.body.token;
    expect(authToken).toBeTruthy();
    userId = response.body.userWithoutPassword._id;
    expect(userId).toBeTruthy();
  });

  it("PUT /users/update/:id should update a user", async () => {
    const response = await request(server)
      .put(`/users/update/${userId}`)
      .send({ firstname: "UpdatedFirstname" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User updated successfully");
    expect(response.body.user).toBeDefined();
  });

  it("POST /blogs/create should create a new blog", async () => {
    const response = await request(server)
    .post("/blogs/create")
    .set("Authorization", `Bearer ${authToken}`)
    .send(mockBlog);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("The blog was added successfully");
    expect(response.body.blog).toBeDefined();
    blogId = response.body._id;
  });

  it("PUT /blogs/update/:id  should update blog", async () => {
    const response = await request(server)
      .put(`/blog/update/${blogId}`)
      .send({description: "updated Description"})
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    console.log( userId, blogId, authToken)
  });

  it("POST /comments/add/:id should add a new comment", async () => {
    const response = await request(server)
      .post(`/comments/add/${blogId}`)
      .send(mockComment);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Comment added successfully");
    expect(response.body.comment).toBeDefined();
  });

  it("PUT /comments/update/:id should update a comment", async () => {
    const response = await request(server)
      .put(`/comments/update/${blogId}`)
      .send({ content: "Updated Comment Content" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment updated successfully");
    expect(response.body.comment).toBeDefined();
  });

  it("DELETE /comment/:id should delete a comment", async () => {
    const response = await request(server).delete('/comment/${blodId}');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Comment deleted successfully");
  });

  it("DELETE blogs/delete/:id  should delete the blog", async () => {
    const res = await request(server).delete(`/blogs/delete1/${blogId}`);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual('The Blog has been removed!')
  });

  it("DELETE blogs/deleteAll should delete the all blogs", async  () => {
    let res=await request(server)
    .set("Authorization", `Bearer ${authToken}`)
     .delete("/blogs/deleteAll") ;
   expect(res.status).toEqual(200);
   expect(res.body.message).toEqual('All Blogs have been removed!') 
  });

  it("DELETE /user/delete/:id should delete a user", async () => {
    const response = await request(server)
      .delete(`/user/delete1/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  it("DELETE /users/deleteAll should delete all users", async () => {
    const response = await request(server)
      .delete("/users/deleteAll")
      .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("All users deleted successfully");
  });

});
