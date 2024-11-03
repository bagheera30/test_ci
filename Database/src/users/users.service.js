import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  findUsersByUsername,
  insertUsers,
  editUsers,
  findAllUsers,
} from "./users.repository";

const prisma = new PrismaClient();

const getAllUsers = async () => {
  return await findAllUsers();
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

  const token = jwt.sign(
    { userId: user.username, role: user.role },
    process.env.JWT_SECRET_KEY
  );

  await prisma.Users.update({
    where: { username: user.username },
    data: { token },
  });

  return { token, role: user.role, username: user.username };
};

const editUsersByName = async (username, userData) => {
  await getUser(username);
  return await editUsers(username, userData);
};

const getUser = async (username) => {
  const user = await findUsersByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }
  return user;
};

export { createUser, loginUser, editUsersByName, getUser, getAllUsers };
