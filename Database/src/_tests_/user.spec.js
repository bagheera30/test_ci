import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  loginUser,
  editUsersByName,
  getUser, // Import getUser
  getAllUsers,
  addSaldo, // Import addSaldo
} from "../users/users.service";

// Mock bcrypt and jwt
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Mock repository functions
jest.mock("../users/users.repository");

process.env.JWT_SECRET_KEY = "test-secret-key";

// Mock user data
const mockUser = {
  username: "testuser",
  password: "testpassword",
  role: "user",
  name: "Test User",
  nomerWA: "1234567890",
  saldo: 0,
};

// Import the mock functions
const {
  findUsersByUsername: mockFindUsersByUsername,
  insertUsers: mockInsertUsers,
  editUsers: mockEditUsers,
  findAllUsers: mockFindAllUsers,
  addSaldo: mockAddSaldo, // Import the mocked addSaldo function
} = require("../users/users.repository");

// Mock Prisma Client
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn(() => ({
      Users: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    })),
  };
});

// Mock generateTokens
jest.mock("../users/users.service", () => ({
  ...jest.requireActual("../users/users.service"), // Import the actual service
  generateTokens: jest.fn(() => ({
    accessToken: "test-token",
    refreshToken: "test-refresh-token",
  })), // Mock function
}));

describe("Users Service", () => {
  let mockPrismaClient;

  beforeAll(() => {
    mockPrismaClient = new (require("@prisma/client").PrismaClient)();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    bcrypt.hash.mockReset();
    bcrypt.compare.mockReset();
    jwt.sign.mockReset();
    mockPrismaClient.Users.create.mockReset();
    mockPrismaClient.Users.findUnique.mockReset();
    mockPrismaClient.Users.update.mockReset();
    mockPrismaClient.Users.findMany.mockReset();
    jwt.sign.mockReturnValue("test-token");
  });

  describe("createUser", () => {
    it("should create a new user with hashed password", async () => {
      bcrypt.hash.mockResolvedValue("hashedPassword");
      mockInsertUsers.mockResolvedValue({
        ...mockUser,
        password: "hashedPassword",
      });

      const result = await createUser(mockUser);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, 10);
      expect(mockInsertUsers).toHaveBeenCalledWith({
        ...mockUser,
        password: "hashedPassword",
      });
      expect(result).toEqual({
        ...mockUser,
        password: "hashedPassword",
      });
    });

    it("should throw an error if username is missing", async () => {
      const userWithoutUsername = { ...mockUser, username: undefined };
      await expect(createUser(userWithoutUsername)).rejects.toThrow(
        "Username is required"
      );
    });
  });

  describe("loginUser", () => {
    it("should return a JWT token and user details if login is successful", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      mockPrismaClient.Users.update.mockResolvedValue(mockUser);

      const result = await loginUser(mockUser.username, mockUser.password);

      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockUser.password,
        mockUser.password // Ensure this is the hashed password in actual implementation
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.username, role: mockUser.role },
        process.env.JWT_SECRET_KEY
      );

      expect(result).toEqual({
        token: "test-token",
        role: mockUser.role,
        username: mockUser.username,
      });
    });

    it("should throw an error if user is not found", async () => {
      mockFindUsersByUsername.mockResolvedValue(null);
      await expect(
        loginUser(mockUser.username, mockUser.password)
      ).rejects.toThrow("User not found");
    });

    it("should throw an error if password is invalid", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      await expect(
        loginUser(mockUser.username, mockUser.password)
      ).rejects.toThrow("Invalid password");
    });
  });

  describe("editUsersByName", () => {
    it("should update user data", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser);
      mockEditUsers.mockResolvedValue(mockUser);

      const result = await editUsersByName(mockUser.username, mockUser);

      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(mockEditUsers).toHaveBeenCalledWith(mockUser.username, mockUser);
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if user is not found", async () => {
      mockFindUsersByUsername.mockResolvedValue(null);
      await expect(
        editUsersByName(mockUser.username, mockUser)
      ).rejects.toThrow(`User ${mockUser.username} not found`);
    });
  });

  describe("addSaldo", () => {
    it("should add saldo to user", async () => {
      const username = "testUser";
      const userData = { saldo: 100 };
      mockAddSaldo.mockResolvedValue({ ...mockUser, saldo: 100 });

      const result = await addSaldo(username, userData); // Use mockAddSaldo

      expect(mockAddSaldo).toHaveBeenCalledWith(userData, username); // Assert on mockAddSaldo
      expect(result).toEqual({ ...mockUser, saldo: 100 });
    });

    it("should throw an error if user is not found", async () => {
      const username = "testUser";
      const userData = { saldo: 100 };

      getUser.mockRejectedValue(new Error("User not found")); // Mock getUser to throw error

      await expect(addSaldo(username, userData)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("getUser", () => {
    it("should return user data", async () => {
      const result = await getUser(mockUser.username); // Use mocked getUser

      expect(getUser).toHaveBeenCalledWith(mockUser.username);
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if user is not found", async () => {
      getUser.mockRejectedValue(new Error("User not found")); // Mock getUser to throw error

      await expect(getUser(mockUser.username)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers = [mockUser, { ...mockUser, username: "anotheruser" }];
      mockFindAllUsers.mockResolvedValue(mockUsers);

      const result = await getAllUsers();

      expect(mockFindAllUsers).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  // No need to change this test
  describe("createUser", () => {
    it("should throw an error if username is missing", async () => {
      const userWithoutUsername = { ...mockUser, username: undefined };
      await expect(createUser(userWithoutUsername)).rejects.toThrow(
        "Username is required"
      );
    });
  });
});
