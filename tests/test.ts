import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import request from "supertest";
import bodyParser from 'body-parser';
import path from "path";
import morgan from "morgan";
import userRoutes from "../src/routes/users";
import blogRoutes from "../src/routes/blogs";
import commentRoutes from "../src/routes/comments";
import upload from "../src/middlewares/upload";
import supertest from "supertest";
import Blog from "../src/models/blogs";
import User from "../src/models/users";

require('dotenv').config();

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/comments", commentRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong! Error: ${err.message}`);
});

app.post(
  "/upload",
  upload.single("file"),
  (req: Request, res: Response) => {
    res.status(200).json({ message: "File uploaded successfully" });
  }
);

interface User {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

interface Blog {
  title: string;
  author: string;
  category: string;
  description: string;
  imgUrl: string;
}

let userId: string;
let adminId: string;
let adminToken: string;
let userToken: string;
let blogId: string;
let id: string;
let commentId: string;

const userWithUserRole: User = {
  firstname: "mucyo",
  lastname: "Didier",
  username: "johndoe",
  email: "john@example.com",
  password: "password123",
};

const userWithUserRoleError: User = {
  firstname: "",
  lastname: "Didier",
  username: "",
  email: "john@example.com",
  password: "password123",
};


const userWithAdminRole: User = {
  firstname: "abayizera",
  lastname: "samuel",
  username: "samAbayizera",
  email: "abayizeraeaz@gmail.com",
  password: "password@123",
};

const mockBlog: Blog = {
  title: "here we go jugumilajhwdga",
  author: "John Doe",
  category: "Technology",
  description: "This is a sample blog description",
  imgUrl: "/home/sam/Pictures/Screenshots/Screenshot from 2024-02-23 00-00-41.png",
};

const mockUpdateBlog: Partial<Blog> = {
  title: "Updated Sample Blog jugumilajhwdga",
  category: "Science",
  description: "This is the updated sample blog description",
  imgUrl: "/home/sam/Pictures/Screenshots/Screenshot from 2024-02-23 15-57-48.png",
};

const mockComment = {
  content: "This is a sample comment",
};

const testingDbURI = process.env.TEST_MONGODB_URI;

beforeAll(async () => {
  if (testingDbURI) {
    try {
      await mongoose.connect(testingDbURI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  } else {
    console.error("TEST_MONGODB_URI environment variable is not defined.");
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Endpoints", () => {
  it("POST /users/signUp should register a user", async () => {
    const response = await request(app)
      .post("/users/signUp")
      .send(userWithUserRole);

    expect(response.status).toBe(200);
    userId = response.body.userWithoutPassword._id;
  });

  it("POST /users/signUp should register a user", async () => {
    const response = await request(app)
      .post("/users/signUp")
      .send(userWithUserRoleError);

    expect(response.status).toBe(400);
  });

  it("POST /users/signUp should register a user", async () => {
    const response = await request(app)
      .post("/users/signUp")
      .send(userWithAdminRole);

    expect(response.status).toBe(200);
    adminId = response.body.userWithoutPassword._id;
  });

  it("should return validation error when signing up with invalid data", async () => {
    const invalidUserData = {
      username: "invalidusername123",
      email: "invalid@email",
      password: "s"
    };

    const response = await request(app)
      .post("/users/signUp")
      .send(invalidUserData);

    expect(response.status).toBe(400);
  });

  it('GET /user/all should get all registered users', async () => {
    const res = await request(app).get("/users/all");
    expect(res.status).toEqual(200);
  });

  it("GET  /users/single/:id should return the requested user profile", async () => {
    const res = await request(app).get(`/users/single/${userId}`);
    expect(res.status).toEqual(200);
  });

  it("POST /users/signIn should log in a user", async () => {
    const response = await request(app).post("/users/signIn").send({
      email: userWithAdminRole.email,
      password: userWithAdminRole.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.userWithoutPassword._id).toBeTruthy();
    adminToken = response.body.token;
  });

   it("POST /users/signIn should log in a user", async () => {
     const response = await request(app).post("/users/signIn").send({
       email: userWithUserRole.email,
       password: userWithUserRole.password,
     });

     expect(response.status).toBe(200);
     expect(response.body.token).toBeTruthy();
     expect(response.body.userWithoutPassword._id).toBeTruthy();
     userToken = response.body.token;
   });
  
  it("POST /users/signIn Invalid request", async () => {
    const response = await request(app).post("/users/signIn").send({});
    expect(response.status).toBe(401);
  });

  it("POST /users/signIn Invalid user", async () => {
    const response = await request(app).post("/users/signIn").send({
      username: "Simon@gmail.com",
      password: "Simon",
    });
    expect(response.status).toBe(401);
  });
  
  it("PUT /users/update should update a user", async () => {
    const response = await request(app)
      .put(`/users/update/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(userWithUserRole);

    expect(response.status).toBe(200);
  });

  it("should return validation error when updating user with invalid data", async () => {
    const invalidUserData = {
      email: "notanemail",
    };

    const response = await request(app)
      .put(`/users/update/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("validationErrors");
  });
});

describe("Failed user", () => {
  it("should handle error when fetching blogs", async () => {
    const res = await request(app).get("/users/all1");
    expect(res.status).toEqual(404);
  });
});

describe("Blog Endpoints", () => {
  it("POST /blogs/create should create new blog", async () => {
    const response = await request(app)
      .post("/blogs/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(mockBlog);
    expect(response.status).toEqual(201);
    blogId = response.body.blog._id;
  });

  it("POST /blogs/create should return 401 without token", async () => {
    const res = await request(app).post("/blogs/create").send(mockBlog);
    expect(res.status).toEqual(401);
  });

  it("GET /blogs/all should fetch all blogs", async () => {
    const response = await request(app)
      .get("/blogs/all")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
  });

  it("GET /blogs/single/:id should fetch a single blog", async () => {
    const response = await request(app)
      .get(`/blogs/single/${blogId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toEqual(200);
  });

  it("PUT /blogs/update/:id should update a blog", async () => {
    const response = await request(app)
      .put(`/blogs/update/${blogId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(mockUpdateBlog);
    expect(response.status).toEqual(200);
  });

  it("PUT /users/update/:id should return 401 without admin token", async () => {
    const res = await request(app)
      .put(`/users/update/${userId}`)
      .send(userWithUserRole);
    expect(res.status).toEqual(401);
  });

  it("PUT /users/update/:id should return 404 without wrong url", async () => {
    const res = await request(app)
      .put("/users/update")
      .send(userWithUserRole);
    expect(res.status).toEqual(404);
  });

  it("should return validation error when creating blog with invalid data", async () => {
    const invalidBlogData = {
      category: "",
      title: "",
    };

    const response = await request(app)
      .post("/blogs/create")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidBlogData);

    expect(response.status).toBe(400);
  });

  it("should return validation error when updating blog with invalid data", async () => {
    const invalidBlogData = {
      title: '',
      content: ""
    };

    const response = await request(app)
      .put(`/blogs/update/${blogId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidBlogData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("validationErrors");
  });
});

describe("UPLOADS endponts", () => {
  it('should upload a file successfully', async () => {
    const response = await supertest(app)
      .post("/upload")

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');
  });
});

describe("Comment Endpoints", () => {
  it("POST /comments/add/:id should add a new comment", async () => {
    const response = await request(app)
      .post(`/comments/add/${blogId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockComment);
    expect(response.status).toBe(201);
    commentId = response.body.comment._id;
  });

  it("PUT /comments/update/:id should update a comment", async () => {
    const response = await request(app)
      .put(`/comments/update/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(mockUpdateBlog);
    expect(response.status).toEqual(200);
  });
});

describe("Delete Comment Endpoints", () => {
  it("DELETE /comments/delete/:id should delete a comment by ID", async () => {
    const response = await request(app)
      .delete(`/comments/delete/${commentId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.status).toBe(200);
  });

  it("DELETE /comments/deleteAll should delete all comments", async () => {
    const response = await request(app)
      .delete("/comments/deleteAll")
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.status).toBe(200);
  });
});

describe("Delete Blog Endpoints", () => {
  it("DELETE /blogs/delete/:id should delete a blog by ID", async () => {
    const response = await request(app)
      .delete(`/blogs/delete/${blogId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  it("DELETE /blogs/deleteAll should delete all blogs", async () => {
    const response = await request(app)
      .delete("/blogs/deleteAll")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });
});

describe("Delete User Endpoints", () => {
  it("DELETE /users/:id should delete a user by ID", async () => {
    const response = await request(app)
      .delete(`/users/delete/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  it("DELETE /users/deleteAll should delete all users", async () => {
    const response = await request(app)
      .delete("/users/deleteAll")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });
});
