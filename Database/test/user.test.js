// tests/users.service.test.ts

const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import {
  createUser,
  loginUser,
  editUsersByName,
  getUser,
  getAllUsers,
} from "../src/users/users.service"; // Adjust the path accordingly

// Mock the repository functions
jest.mock("./users.repository", () => ({
  findUsersByUsername: jest.fn(),
  insertUsers: jest.fn(),
  editUsers: jest.fn(),
  findAllUsers: jest.fn(),
}));

const {
  findUsersByUsername,
  insertUsers,
  editUsers,
  findAllUsers,
} = require("./users.repository");

describe("User  Service", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("getAllUsers", () => {
    it("should return a list of users", async () => {
      const mockUsers = [
        { username: "user1", role: "admin" },
        { username: "user2", role: "user" },
      ];
      findAllUsers.mockResolvedValue(mockUsers);

      const users = await getAllUsers();
      expect(users).toEqual(mockUsers);
      expect(findAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe("createUser ", () => {
    it("should create a new user with a hashed password", async () => {
      const userData = {
        username: "newUser ",
        password: "password123",
        role: "user",
      };
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const mockUser = { ...userData, password: hashedPassword };

      insertUsers.mockResolvedValue(mockUser);

      const user = await createUser(userData);
      expect(user).toEqual(mockUser);
      expect(insertUsers).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
      });
    });
  });

  describe("loginUser ", () => {
    it("should return a token and user details on successful login", async () => {
      const username = "existingUser ";
      const password = "password123";
      const mockUser = {
        username,
        password: await bcrypt.hash(password, 10),
        userId: "1",
        role: "user",
      };
      findUsersByUsername.mockResolvedValue(mockUser);
      process.env.JWT_SECRET_KEY = "secret";

      const token = await loginUser(username, password);
      expect(token).toHaveProperty("token");
      expect(token).toHaveProperty("role", mockUser.role);
      expect(token).toHaveProperty("username", mockUser.username);
      expect(findUsersByUsername).toHaveBeenCalledWith(username);
    });

    it("should throw an error if the user is not found", async () => {
      findUsersByUsername.mockResolvedValue(null);

      await expect(
        loginUser("nonExistentUser ", "password123")
      ).rejects.toThrow("User  not found");
    });

    it("should throw an error if the password is invalid", async () => {
      const username = "existingUser ";
      const mockUser = {
        username,
        password: await bcrypt.hash("correctPassword", 10),
      };
      findUsersByUsername.mockResolvedValue(mockUser);

      await expect(loginUser(username, "wrongPassword")).rejects.toThrow(
        "Invalid password"
      );
    });
  });

  describe("editUsersByName", () => {
    it("should edit user details", async () => {
      const username = "existingUser ";
      const userData = { role: "admin" };
      const mockUser = { username, role: "user" };
      findUsersByUsername.mockResolvedValue(mockUser);
      editUsers.mockResolvedValue({ ...mockUser, ...userData });

      const updatedUser = await editUsersByName(username, userData);
      expect(updatedUser).toEqual({ ...mockUser, ...userData });
      expect(editUsers).toHaveBeenCalledWith(username, userData);
    });

    it("should throw an error if the user is not found", async () => {
      findUsersByUsername.mockResolvedValue(null);

      await expect(editUsersByName("nonExistentUser ", {})).rejects.toThrow(
        `User  nonExistentUser  not found`
      );
    });
  });

  describe("getUser ", () => {
    it("should return a user by username", async () => {
      const username = "existingUser ";
      const mockUser = { username, role: "user" };
      findUsersByUsername.mockResolvedValue(mockUser);

      const user = await getUser(username);
      expect(user).toEqual(mockUser);
      expect(findUsersByUsername).toHaveBeenCalledWith(username);
    });

    it("should throw an error if the user is not found", async () => {
      findUsersByUsername.mockResolvedValue(null);

      await expect(getUser("nonExistentUser ")).rejects.toThrow(
        `User  nonExistentUser  not found`
      );
    });
  });
});
