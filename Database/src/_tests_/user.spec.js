import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  loginUser,
  editUsersByName,
  getUser,
  getAllUsers,
} from "../users/users.service";

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

const mockPrismaClient = new (require("@prisma/client").PrismaClient)();

// Mock bcrypt and jwt
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

process.env.JWT_SECRET_KEY = "test-secret-key";

const mockUser = {
  username: "testuser",
  password: "testpassword",
  role: "user",
  name: "Test User",
  nomerWA: "1234567890",
};

const mockFindUsersByUsername = jest.fn();
const mockInsertUsers = jest.fn();
const mockEditUsers = jest.fn();
const mockFindAllUsers = jest.fn();

jest.mock("../users/users.repository", () => ({
  findUsersByUsername: mockFindUsersByUsername,
  insertUsers: mockInsertUsers,
  editUsers: mockEditUsers,
  findAllUsers: mockFindAllUsers,
}));

describe("Users Service", () => {
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
        mockUser.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser.username, role: mockUser.role },
        process.env.JWT_SECRET_KEY
      );
      expect(mockPrismaClient.Users.update).toHaveBeenCalledWith({
        where: { username: mockUser.username },
        data: { token: "test-token" },
      });
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

  describe("getUser", () => {
    it("should return user data", async () => {
      mockFindUsersByUsername.mockResolvedValue(mockUser);

      const result = await getUser(mockUser.username);

      expect(mockFindUsersByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(result).toEqual(mockUser);
    });

    it("should throw an error if user is not found", async () => {
      mockFindUsersByUsername.mockResolvedValue(null);
      await expect(getUser(mockUser.username)).rejects.toThrow(
        `User ${mockUser.username} not found`
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
});
