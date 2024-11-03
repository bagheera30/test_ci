import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock PrismaClient
const mockPrismaClient = {
  Users: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const { createUser , loginUser , editUsersByName, getUser , getAllUsers } = require("../users/users.service");

// Mock bcrypt
jest.mock("bcrypt");
const bcryptMock = require("bcrypt");

// Mock jwt
jest.mock("jsonwebtoken");
const jwtMock = require("jsonwebtoken");

// Mock environment variables
process.env.JWT_SECRET_KEY = "test-secret-key";

// Mock user data
const mockUser  = {
  username: "testuser",
  password: "testpassword",
  role: "user",
  name: "Test User",
  nomerWA: "1234567890",
};

// Mock database functions
const mockFindUsersByUsername = jest.fn();
const mockFindAllUsers = jest.fn();

// Mock bcrypt functions
const mockHash = jest.fn();
const mockCompare = jest.fn();

// Mock jwt functions
const mockSign = jest.fn();

describe("Users Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    bcryptMock.hash.mockReset();
    bcryptMock.compare.mockReset();
    jwtMock.sign.mockReset();
    mockPrismaClient.Users.create.mockReset();
    mockPrismaClient.Users.findUnique.mockReset();
    mockPrismaClient.Users.update.mockReset();
  });

  describe("createUser ", () => {
    it("should create a new user with hashed password", async () => {
      bcryptMock.hash.mockResolvedValue("hashedPassword");
      mockPrismaClient.Users.create.mockResolvedValue({
        ...mockUser ,
        password: "hashedPassword",
      });

      const result = await createUser(mockUser);

expect(bcryptMock.hash).toHaveBeenCalledWith(mockUser.password, 10);
expect(mockPrismaClient.Users.create).toHaveBeenCalledWith({
  data: {
    ...mockUser,
    password: "hashedPassword",
    token: "test-token", // Tambahkan token
  },
});
expect(result).toEqual({
  ...mockUser,
  password: "hashedPassword",
  token: "test-token", // Tambahkan token
});
    });
  });

  describe("loginUser ", () => {
    it("should return a JWT token and user details if login is successful", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser );
      bcryptMock.compare.mockResolvedValue(true);
      jwtMock.sign.mockReturnValue("test-token");
      mockPrismaClient.Users.update.mockResolvedValue(mockUser );

      const result = await loginUser (mockUser .username, mockUser .password);

      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser .username);
      expect(bcryptMock.compare).toHaveBeenCalledWith(mockUser .password, mockUser .password);
      expect(jwtMock.sign).toHaveBeenCalledWith(
        { userId: mockUser .username, role: mockUser .role },
        process.env.JWT_SECRET_KEY
      );
      expect(mockPrismaClient.Users.update).toHaveBeenCalledWith({
        where: { username: mockUser .username },
        data: { token: "test-token" },
      });
      expect(result).toEqual({
        token: "test-token",
        role: mockUser .role,
        username: mockUser .username,
      });
    });

    it("should throw an error if user is not found", async () => {
      mockFindUsersByUsername.mockResolvedValue(null);

      await expect(loginUser (mockUser .username, mockUser .password)).rejects.toThrow("User not found");
    });

    it("should throw an error if password is invalid", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser );
      bcryptMock.compare.mockResolvedValue(false);

      await expect(loginUser (mockUser .username, mockUser .password)).rejects.toThrow("Invalid password");
    });
  });

  describe("editUsersByName", () => {
    it("should update user data", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser );
      mockPrismaClient.Users.update.mockResolvedValue(mockUser );

      const result = await editUsersByName(mockUser .username, mockUser );

      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser .username);
      expect(mockPrismaClient.Users.update).toHaveBeenCalledWith({
        where: { username: mockUser .username },
        data: mockUser ,
      });
      expect(result).toEqual(mockUser );
    });

    it("should throw an error if user is not found", async () => {
      mockFindUsersByUsername.mockResolvedValue(null);

      await expect(editUsersByName(mockUser .username, mockUser )).rejects.toThrow(`User ${mockUser .username} not found`);
    });
  });

  describe("getUser ", () => {
    it("should return user data", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser );

      const result = await getUser (mockUser .username);

      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser  .username);
      expect(result).toEqual(mockUser );
    });

    it("should throw an error if user is not found", async () => {
      mockFindUsersByUsername.mockResolvedValue(null);

      await expect(getUser  (mockUser .username)).rejects.toThrow(`User ${mockUser .username} not found`);
    });
  });

  describe("getAllUsers ", () => {
    it("should return all users", async () => {
      const mockUsers = [mockUser , { ...mockUser , username: "anotheruser" }];
      mockFindAllUsers.mockResolvedValue(mockUsers);

      const result = await getAllUsers();

      expect(mockFindAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});