import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock PrismaClient
const mockPrismaClient = {
  Users: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    // Add other methods that are used in your service
  },
};

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const { PrismaClient } = require("@prisma/client");
const {
  createUser ,
  loginUser ,
  editUsersByName,
  getUser ,
  getAllUsers,
} = require("../users/users.service");

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
};

// Mock database functions
const mockFindUsersByUsername = jest.fn();
const mockInsertUsers = jest.fn();
const mockEditUsers = jest.fn();
const mockFindAllUsers = jest.fn();

// Mock bcrypt functions
const mockHash = jest.fn();
const mockCompare = jest.fn();

// Mock jwt functions
const mockSign = jest.fn();

describe("Users Service", () => {
  beforeEach(() => {
    // Reset mocks before each test
    bcryptMock.hash.mockReset();
    bcryptMock.compare.mockReset();
    jwtMock.sign.mockReset();
    mockFindUsersByUsername.mockReset();
    mockInsertUsers.mockReset();
    mockEditUsers.mockReset();
    mockFindAllUsers.mockReset();
    mockPrismaClient.Users.create.mockReset(); // Reset create mock
    mockPrismaClient.Users.findUnique.mockReset(); // Reset findUnique mock
    mockPrismaClient.Users.update.mockReset(); // Reset update mock
  });

  describe("createUser ", () => {
    it("should create a new user with hashed password", async () => {
      // Arrange
      bcryptMock.hash.mockResolvedValue("hashedPassword");
      mockPrismaClient.Users.create.mockResolvedValue(mockUser ); // Mock create method

      // Act
      const result = await createUser (mockUser );

      // Assert
      expect(bcryptMock.hash).toHaveBeenCalledWith(mockUser .password, 10);
      expect(mockPrismaClient.Users.create).toHaveBeenCalledWith({
        data: {
          ...mockUser ,
          password: "hashedPassword",
        },
      });
      expect(result).toEqual(mockUser );
    });
  });

  describe("loginUser ", () => {
    it("should return a JWT token and user details if login is successful", async () => {
      // Arrange
      mockFindUsersByUsername.mockResolvedValue(mockUser );
      bcryptMock.compare.mockResolvedValue(true);
      jwtMock.sign.mockReturnValue("test-token");
      mockPrismaClient.Users.update.mockResolvedValue(mockUser ); // Use the mocked instance

      // Act
      const result = await loginUser (mockUser .username, mockUser .password);

      // Assert
      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser .username);
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        mockUser .password,
        mockUser .password
      );
      expect(jwtMock.sign).toHaveBeenCalledWith(
        { userId: mockUser .userId, role: mockUser .role },
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
      // Arrange
      mockFindUsersByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(
        loginUser (mockUser .username, mock User  .password)
      ).rejects.toThrow("User   not found");
    });

    it("should throw an error if password is invalid", async () => {
      // Arrange
      mockFindUsersByUsername.mockResolvedValue(mockUser );
      bcryptMock.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(
        loginUser (mockUser .username, mockUser .password)
      ).rejects.toThrow("Invalid password");
    });
  });

  describe("editUsersByName", () => {
    it("should update user data", async () => {
      // Arrange
      mockFindUsersByUsername.mockResolvedValue(mockUser );
      mockEditUsers.mockResolvedValue(mockUser );

      // Act
      const result = await editUsersByName(mockUser .username, mockUser );

      // Assert
      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser .username);
      expect(mockEditUsers).toHaveBeenCalledWith(mockUser .username, mockUser );
      expect(result).toEqual(mockUser );
    });

    it("should throw an error if user is not found", async () => {
      // Arrange
      mockFindUsersByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(
        editUsersByName(mockUser .username, mockUser )
      ).rejects.toThrow(`User ${mockUser  .username} not found`);
    });
  });

  describe("getUser ", () => {
    it("should return user data", async () => {
      // Arrange
      mockFindUsersByUsername.mockResolvedValue(mockUser );

      // Act
      const result = await getUser (mockUser .username);

      // Assert
      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser .username);
      expect(result).toEqual(mockUser );
    });

    it("should throw an error if user is not found", async () => {
      // Arrange
      mockFindUsersByUsername.mockResolvedValue(null);

      // Act & Assert
      await expect(getUser  (mockUser .username)).rejects.toThrow(
        `User ${mockUser .username} not found`
      );
    });
  });

  describe("getAllUsers ", () => {
    it("should return all users", async () => {
      // Arrange
      const mockUsers = [mockUser , { ...mockUser , username: "anotheruser" }];
      mockFindAllUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await getAllUsers ();

      // Assert
      expect(mockFindAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});
