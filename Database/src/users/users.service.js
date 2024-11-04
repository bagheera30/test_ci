import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  findUsersByUsername,
  insertUsers,
  editUsers,
  findAllUsers,
  addSaldo, // Import from users.repository
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

// Renamed function
const addSaldoToAccount = async (username, userData) => {
  await getUser(username);
  return await addSaldo(username, userData); // Use the imported addSaldo
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

  // const { accessToken, refreshToken } = generateTokens(user);

  // await prisma.Users.update({
  //   where: { username: user.username },
  //   data: { token: refreshToken }, // Save refresh token in DB
  // });

  return {
    accessToken,
    // refreshToken,
    role: user.role,
    username: user.username,
  };
};

// Refresh access token
// const refreshAccessToken = async (refreshToken) => {
//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
//     const user = await findUsersByUsername(decoded.userId);

//     if (!user || user.token !== refreshToken) {
//       throw new Error("Invalid refresh token");
//     }

//     const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

//     // Update refresh token in the database
//     await prisma.Users.update({
//       where: { username: user.username },
//       data: { token: newRefreshToken },
//     });

//     return { accessToken, refreshToken: newRefreshToken };
//   } catch (error) {
//     throw new Error("Invalid or expired refresh token");
//   }
// };

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

export {
  createUser,
  loginUser,
  editUsersByName,
  getUser,
  getAllUsers,
  addSaldoToAccount, // Exported with the new name
  // refreshAccessToken,
};
