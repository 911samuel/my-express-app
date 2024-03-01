import mongoose from "mongoose";
import request from "supertest";
import app from "../server";

interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profile: string;
}

interface Blog {
  title: string;
  author: string;
  category: string;
  description: string;
  imgUrl: string;
}

let userId: number;
let token: string;
let blogId: number;
let commentId: number;

const mockUser: User = {
  firstname: "mucyo",
  lastname: "Didier",
  username: "johndoe",
  email: "john@example.com",
  password: "password123",
  role: "admin",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};

const mockBlog: Blog = {
  title: "Sample Blog",
  author: "John Doe",
  category: "Technology",
  description: "This is a sample blog description",
  imgUrl: "https://example.com/sample-image.jpg",
};

const mockUpdateBlog: Partial<Blog> = {
  title: "Updated Sample Blog",
  category: "Science",
  description: "This is the updated sample blog description",
  imgUrl: "https://example.com/updated-sample-image.jpg",
};

const mockComment = {
  content: "This is a sample comment",
};

describe("API Endpoints", () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(
        "mongodb+srv://abayizeraeaz:Ganza4.rw@testing.z8gytz3.mongodb.net/testing"
      );
      console.log("MongoDB connection successful");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    app.close();
  });

  describe("User Endpoints", () => {
    it("POST /users/signUp should register a user", async () => {
      const response = await request(app).post("/users/signUp").send(mockUser);

      expect(response.status).toBe(200);
      userId = response.body.userWithoutPassword._id;
    });

    it("PUT /users/update should update a user", async () => {
      const response = await request(app)
        .put(`/users/update/${userId}`)
        .send(mockUser);

      expect(response.status).toBe(200);
    });

    it("POST /users/signIn should log in a user", async () => {
      const response = await request(app)
        .post("/users/signIn")
        .send({ email: mockUser.email, password: mockUser.password });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.userWithoutPassword._id).toBeTruthy();

      token = response.body.token;
    });
  });

  describe("Blog Endpoints", () => {
    it("POST /blogs/create should create new blog", async () => {
      const response = await request(app)
        .post("/blogs/create")
        .set("Authorization", `Bearer ${token}`)
        .send(mockBlog);

      expect([201, 403].includes(response.status)).toBeTruthy();
      if (response.status === 201) {
        expect(response.body.message).toBe("The blog was added successfully");
        console.log(response.body);
        expect(response.body.blog).toBeDefined();
      } else {
        expect(response.body.message).toBe(
          "Unauthorized: User is not an admin"
        );
      }
      blogId = response.body.blog._id;
    });

    it("GET /blogs/all should fetch all blogs or return 403 Forbidden for unauthorized access", async () => {
      const response = await request(app)
        .get("/blogs/all")
        .set("Authorization", `Bearer ${token}`);

      expect([200, 403].includes(response.status)).toBeTruthy();

      if (response.status === 200) {
        expect(response.body.message).toBe("Blogs fetched successfully");
        expect(response.body.blogs).toBeDefined();
      } else {
        expect(response.body.message).toBe(
          "Unauthorized: User is not authorized to access all blogs"
        );
      }
    });

    it("GET /blogs/single/:id should fetch a single blog or return 403 Forbidden for unauthorized access", async () => {
      const response = await request(app)
        .get(`/blogs/single/${blogId}`)
        .set("Authorization", `Bearer ${token}`);

      expect([200, 403].includes(response.status)).toBeTruthy();

      if (response.status === 200) {
        expect(response.body.message).toBe("Blog fetched successfully");
        expect(response.body.blog).toBeDefined();
      } else {
        expect(response.body.message).toBe(
          "Unauthorized: User is not authorized to access this blog"
        );
      }
    });

    it("PUT /blogs/update/:id should update a blog or return 403 Forbidden for unauthorized access", async () => {
      const response = await request(app)
        .put(`/blogs/update/${blogId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(mockUpdateBlog);

      expect([200, 403].includes(response.status)).toBeTruthy();

      if (response.status === 200) {
        expect(response.body.message).toBe("Blog updated successfully");
        expect(response.body.blog).toBeDefined();
      } else {
        expect(response.body.message).toBe(
          "Unauthorized: User is not authorized to update this blog"
        );
      }
    });
  });

  describe("Comment Endpoints", () => {
    it("POST /comments/add/:id should add a new comment", async () => {
      const response = await request(app)
        .post(`/comments/add/${blogId}`)
        .send(mockComment)
        .set("Authorization", `Bearer ${token}`);

        console.log(response.body);

      expect(response.status).toBe(201);
    });
  });

  describe("Delete Comment Endpoints", () => {
    it("DELETE /comments/delete/:id should delete a comment by ID", async () => {

      const response = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Comment deleted successfully");
    });

    it("DELETE /comments/deleteAll should delete all comments", async () => {
      const response = await request(app)
      .delete("/comments/deleteAll")
      .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("All comments deleted successfully");
    });
  });

  describe("Delete Blog Endpoints", () => {
    it("DELETE /blogs/delete/:id should delete a blog by ID", async () => {
      const response = await request(app)
      .delete(`/blogs/delete/${blogId}`)
      .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Blog deleted successfully");
    });

    it("DELETE /blogs/deleteAll should delete all blogs", async () => {
      const response = await request(app).delete("/blogs/deleteAll");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("All blogs deleted successfully");
    });
  });

  describe("Delete User Endpoints", () => {
    it("DELETE /users/:id should delete a user by ID", async () => {
      const response = await request(app)
      .delete(`/users/delete/${userId}`)
      .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User deleted successfully");
    });

    it("DELETE /users/deleteAll should delete all users", async () => {
      const response = await request(app)
      .delete("/users/deleteAll")
      .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("All users deleted successfully");
    });
  });
});
