const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  loginUser,
  editUsersByname,
  getAllUsers,
  getuserByusername,
} = require("../src/users/users.service");
const {
  findUsersByUsername,
  insertUsers,
  editUsers,
  fiindAllUsers,
} = require("../src/users/users.repository");

// Mock data for testing
const mockUsers = [
  {
    userId: "1",
    username: "userA",
    name: "User A",
    nomerWA: "081234567890",
    password: "passwordA",
    role: "user",
  },
  {
    userId: "2",
    username: "userB",
    name: "User B",
    nomerWA: "089876543210",
    password: "passwordB",
    role: "admin",
  },
];

jest.mock("../src/users/users.repository.ts", () => ({
  findUsersByUsername: jest.fn((username) =>
    Promise.resolve(mockUsers.find((user) => user.username === username))
  ),
  insertUsers: jest.fn((userData) =>
    Promise.resolve({ ...userData, userId: "3" })
  ),
  editUsers: jest.fn((username, userData) =>
    Promise.resolve({
      ...mockUsers.find((user) => user.username === username),
      ...userData,
    })
  ),
  fiindAllUsers: jest.fn(() => Promise.resolve(mockUsers)),
}));

// Mock bcrypt for testing
jest.mock("bcrypt", () => ({
  hash: jest.fn((password, saltRounds) => Promise.resolve("hashedPassword")),
  compare: jest.fn((password, hash) =>
    Promise.resolve(password === "passwordA")
  ),
}));

// Mock jwt for testing
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn((payload, secret) => Promise.resolve("mockToken")),
}));

describe("User Service", () => {
  it("should create a new user", async () => {
    const newUser = {
      username: "userC",
      name: "User C",
      nomerWA: "081111111111",
      password: "passwordC",
      role: "user",
    };

    const createdUser = await createUser(newUser);

    expect(createdUser).toEqual({
      ...newUser,
      userId: "3",
      password: "hashedPassword", // Hashed password
    });
    expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10);
    expect(insertUsers).toHaveBeenCalledWith({
      ...newUser,
      password: "hashedPassword",
    });
  });

  it("should login a user", async () => {
    const username = "userA";
    const password = "passwordA";

    const user = await loginUser(username, password);

    expect(user.token).toBe("mockToken");
    expect(user.role).toBe("user");
    expect(user.username).toBe(username);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, "passwordA");
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: "1", role: "user" },
      "{process.env.JWT_SECRET_KEY}"
    );
  });

  it("should throw an error if user not found", async () => {
    const username = "nonexistentUser";
    const password = "password";

    await expect(loginUser(username, password)).rejects.toThrowError(
      "User not found"
    );
    expect(findUsersByUsername).toHaveBeenCalledWith(username);
  });

  it("should throw an error if invalid password", async () => {
    const username = "userA";
    const password = "wrongPassword";

    await expect(loginUser(username, password)).rejects.toThrowError(
      "Invalid password"
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(password, "passwordA");
  });

  it("should edit a user by username", async () => {
    const username = "userA";
    const updatedUser = {
      name: "Updated User A",
      nomerWA: "081111111111",
    };

    const editedUser = await editUsersByname(username, updatedUser);

    expect(editedUser).toEqual({
      ...mockUsers[0],
      ...updatedUser,
    });
    expect(editUsers).toHaveBeenCalledWith(username, updatedUser);
  });

  it("should throw an error if user not found for editing", async () => {
    const username = "nonexistentUser";
    const updatedUser = {
      name: "Updated User",
    };

    await expect(editUsersByname(username, updatedUser)).rejects.toThrowError(
      `User ${username} not found`
    );
    expect(findUsersByUsername).toHaveBeenCalledWith(username);
  });

  it("should get all users", async () => {
    const users = await getAllUsers();
    expect(users).toEqual(mockUsers);
    expect(fiindAllUsers).toHaveBeenCalledTimes(1);
  });

  it("should get a user by username", async () => {
    const username = "userA";
    const user = await getuserByusername(username);
    expect(user).toEqual(mockUsers[0]);
    expect(findUsersByUsername).toHaveBeenCalledWith(username);
  });
});
