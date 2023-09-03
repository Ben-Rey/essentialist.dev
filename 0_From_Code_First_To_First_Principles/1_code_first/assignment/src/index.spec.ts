import request from "supertest";
import app from "./app";
import { prismaMock } from "./prisma/__mocks__/prisma";
import {
  emailAlreadyInUse,
  userNameTaken,
  userNotFound,
  validationError,
} from "./constant/responses";

const mockUser = {
  id: 1,
  email: "alice@alice.net",
  username: "alice",
  firstName: "Alice",
  lastName: "Johnson",
  password: "alice123",
};

const mockUserResponse = {
  data: {
    id: 1,
    username: "alice",
    email: "alice@alice.net",
    firstName: "Alice",
    lastName: "Johnson",
  },
  success: true,
};

describe("POST /users/new", () => {
  it("should return a 409 if username is taken", async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { ...mockUser, email: "test@test.net" },
    ]);
    const response = await request(app).post("/users/new").send(mockUser);
    expect(response.status).toBe(userNameTaken.status);
    expect(response.body).toEqual(userNameTaken.data);
  });

  it("should return a 409 if email is taken", async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { ...mockUser, username: "fakeName" },
    ]);
    const response = await request(app).post("/users/new").send(mockUser);
    expect(response.status).toBe(emailAlreadyInUse.status);
    expect(response.body).toEqual(emailAlreadyInUse.data);
  });

  it("should return a 400 if validation error", async () => {
    const response = await request(app)
      .post("/users/new")
      .send({ ...mockUser, email: "notanemail" });
    expect(response.status).toBe(validationError.status);
    expect(response.body).toEqual(validationError.data);

    const response2 = await request(app)
      .post("/users/new")
      .send({ username: "alice" });
    expect(response2.status).toBe(validationError.status);
    expect(response2.body).toEqual(validationError.data);
  });

  it("should return a 201 and create a user", async () => {
    prismaMock.user.create.mockResolvedValue(mockUser);
    const response = await request(app).post("/users/new").send(mockUser);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockUserResponse);
  });
});

describe("POST /users/edit/:userId", () => {
  it("should return a 404 if user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const response = await request(app).post("/users/edit/1").send(mockUser);
    expect(response.status).toBe(userNotFound.status);
    expect(response.body).toEqual(userNotFound.data);
  });

  it("should return a 409 if username is taken", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.user.findFirst.mockResolvedValue(mockUser);
    const response = await request(app).post("/users/edit/1").send(mockUser);
    expect(response.status).toBe(userNameTaken.status);
    expect(response.body).toEqual(userNameTaken.data);
  });

  it("should return a 409 if email is taken", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.user.findFirst.mockResolvedValue(mockUser);
    const response = await request(app).post("/users/edit/1").send(mockUser);
    expect(response.status).toBe(userNameTaken.status);
    expect(response.body).toEqual(userNameTaken.data);
  });

  it("should return a 400 if validation error", async () => {
    const response = await request(app)
      .post("/users/edit/1")
      .send({ email: "notanemail" });
    expect(response.status).toBe(validationError.status);
    expect(response.body).toEqual(validationError.data);
  });

  it("should return a 200 if user was updated", async () => {
    const updatedUser = {
      ...mockUser,
      username: "bob",
    };
    const updatedUserResponse = {
      ...mockUserResponse,
      data: {
        ...mockUserResponse.data,
        username: "bob",
      },
    };
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    prismaMock.user.update.mockResolvedValue(updatedUser);

    const response = await request(app)
      .post("/users/edit/1")
      .send(mockUserResponse);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedUserResponse);
  });
});

describe("GET /users", () => {
  it("should return a 404 if email is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const response = await request(app).get("/users?email=notfound@test.net");
    expect(response.status).toBe(userNotFound.status);
    expect(response.body).toEqual(userNotFound.data);
  });

  it("should return a 200 if email is found ", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    const response = await request(app).get("/users?email=alice@alice.net");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserResponse);
  });
});
