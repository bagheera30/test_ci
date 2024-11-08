import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const {
  findUsersByUsername,
  insertUsers,
  editUsers,
  findAllUsers,
} = require("./users.repository");

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

const notifyUsers = (product) => {
  // Logika untuk mengirim notifikasi
  console.log(`Notify users: New product added - ${product.name}`);
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

const deleteUser = async (username) => {
  const user = await findUsersByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  await prisma.Users.delete({
    where: { username: username },
  });

  return { message: `User ${username} has been deleted successfully` };
};

const updatePassword = async (username, newPassword) => {
  const user = await findUsersByUsername(username);
  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.Users.update({
    where: { username: username },
    data: { password: hashedPassword },
  });

  return { message: `Password for ${username} has been updated successfully` };
};

// TAMBAHAN: Ekspor fungsi updatePassword
export {
  createUser,
  loginUser,
  editUsersByName,
  getUser,
  getAllUsers,
  deleteUser,
  updatePassword,
};
