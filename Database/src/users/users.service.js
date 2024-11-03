import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient if needed
const {
  findUsersByUsername,
  insertUsers,
  editUsers,
  findAllUsers,
} = require("./users.repository"); // Use ES6 import syntax

const db = require("../libs/db");
const prisma = db.getInstance();

const getAllUsers = async () => {
  const users = await findAllUsers();
  return users;
};

const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await insertUsers({
    ...userData,
    password: hashedPassword,
  });
  return user;
};

const loginUser = async (username, password) => {
  const user = await findUsersByUsername(username);
  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  const token = process.env.JWT_SECRET_KEY
    ? jwt.sign(
        { userId: user.userId, role: user.role },
        process.env.JWT_SECRET_KEY
      )
    : null;

  try {
    await prisma.Users.update({
      where: { username: user.username },
      data: { token: token },
    });
    console.log(
      "🚀 ~ file: users.service.ts:41 ~ loginUser ~ token:",
      user.role
    );
  } catch (error) {
    console.error("Error storing token in database:", error);
    // Handle database error appropriately
  }

  return { token, role: user.role, username: user.username };
};

const editUsersByName = async (username, userData) => {
  await getUser(username);
  const user = await editUsers(username, userData);
  return user;
};

const getUser = async (username) => {
  const user = await findUsersByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }
  return user;
};

export { createUser, loginUser, editUsersByName, getUser, getAllUsers };
