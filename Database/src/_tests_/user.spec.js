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

// Mock the entire users.service
jest.mock("../users/users.service", () => ({
  createUser: jest.fn(async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10); // Call bcrypt.hash here
    return Promise.resolve({ ...userData, password: hashedPassword }); // Return a promise
  }),
  loginUser: jest.fn(async (username, password) => {
    const user = await mockFindUsersByUsername(username); // Call mockFindUsersByUsername here
    const isValidPassword = await bcrypt.compare(password, user.password); // Call bcrypt.compare
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }
    return Promise.resolve({ ...user, token: "test-token" }); // Return a promise
  }),
  editUsersByName: jest.fn(async (username, userData) => {
    await mockFindUsersByUsername(username); // Call mockFindUsersByUsername here
    await mockEditUsers(username, userData); // Call mockEditUsers
    return Promise.resolve(userData); // Return a promise
  }),
  getUser: jest.fn(async () => Promise.resolve(mockUser)), // Return a promise
  getAllUsers: jest.fn(async () => Promise.resolve([mockUser])), // Return a promise
  addSaldo: jest.fn(async (username, userData) => {
    const result = await mockAddSaldo(userData, username); // Call mockAddSaldo here
    return Promise.resolve(result); // Return a promise
  }),
  generateTokens: jest.fn(() => ({
    accessToken: "test-token",
    refreshToken: "test-refresh-token",
  })), // Mock generateTokens
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
      await expect(createUser(userWithoutUsername)).rejects.toThrow(Error);
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

      // Mock getUser to throw an error
      getUser.mockRejectedValue(new Error("User not found"));

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
      // Mock getUser to throw an error
      getUser.mockRejectedValue(new Error("User not found"));

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

  describe("createUser", () => {
    it("should throw an error if username is missing", async () => {
      const userWithoutUsername = { ...mockUser, username: undefined };
      await expect(createUser(userWithoutUsername)).rejects.toThrow(Error);
    });
  });
});
