export {};
const db = require("../libs/db");

const prisma = db.getInstance();

const findAllUsers = async () => {
  const users = await prisma.users.findMany();
  return users;
};

const findUsersByUsername = async (username) => {
  const user = await prisma.Users.findUnique({
    where: {
      username: username,
    },
  });
  return user;
};
// In users.repository.js
const addSaldo = async (username, saldo) => {
  // Logic to update the user's saldo in the database
  return await prisma.Users.update({
    where: { username },
    data: { saldo: { increment: saldo } }, // Assuming saldo is a numeric field
  });
};



const insertUsers = async (usersData) => {
  const users = await prisma.Users.create({
    data: {
      name: usersData.name,
      username: usersData.username,
      password: usersData.password,
      nomerWA: usersData.nomerWA,
      token: usersData.token,
    },
  });
  return users;
};
const editUsers = async (username, usersData) => {
  const users = await prisma.Users.update({
    where: {
      username,
    },
    data: {
      name: usersData.name,
      username: usersData.username,
      password: usersData.password,
      nomerWA: usersData.nomerWA,
    },
  });
  return users;
};
module.exports = {
  findUsersByUsername,
  insertUsers,
  editUsers,
  findAllUsers,
  addSaldo,
};
