import request from "supertest";
import server from "../server"; 

let authToken: string;
let userId: number; 

const mockUser = {
  firstname: "Test",
  lastname: "User",
  username: "testuser1234567890",
  email: "test@example.com",
  password: "Test1234",
  role: "user",
  profile: "Test Profile"
};

it("POST /user/signUp should register a user", async () => {
  const response = await request(server)
    .post("/user/signUp")
    .send(mockUser);
  expect(response.status).toBe(200);
});

it("POST /user/signIn should log in a user", async () => {
  const response = await request(server)
    .post("/user/signIn")
    .send({ email: mockUser.email, password: mockUser.password });
  expect(response.status).toBe(200);
  authToken = response.body.token;
  expect(authToken).toBeTruthy();
  userId = response.body._id;
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

export  {authToken, userId};
