export { }
const db = require("../libs/db");


const prisma = db.getInstance();

const fiindAllUsers = async () => {
    const users = await prisma.Users.findMany();
    return users;
}

const findUsersByUsername = async (username: string) => {
    const user = await prisma.Users.findUnique({
        where: {
            username: username,
        },

    });
    return user;
}

const insertUsers = async (usersData: any) => {

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
}
const editUsers = async (username: string, usersData: any) => {
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

}
module.exports = {
    findUsersByUsername,
    insertUsers,
    editUsers,
    fiindAllUsers
}