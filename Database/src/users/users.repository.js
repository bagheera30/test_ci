// users.repository.js
import { prisma } from "@prisma/client"; // Assuming you have a Prisma client instance

export const findUsersByUsername = async (username) => {
  return await prisma.Users.findUnique({ where: { username } });
};

export const insertUsers = async (user) => {
  return await prisma.Users.create({ data: user });
};

export const editUsers = async (username, userData) => {
  return await prisma.Users.update({
    where: { username },
    data: userData,
  });
};

export const findAllUsers = async () => {
  return await prisma.Users.findMany();
};

export const addSaldo = async (username, userData) => {
  // Implement the logic to add saldo for the user
  const user = await findUsersByUsername(username);
  if (!user) {
    throw new Error("User  not found");
  }
  return await prisma.Users.update({
    where: { username },
    data: { saldo: user.saldo + userData.saldo },
  });
};

// Export the get function
export const get = async (username) => {
  return await findUsersByUsername(username);
};