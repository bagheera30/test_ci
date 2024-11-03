import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const db = require("../libs/db");
const prisma = db.getInstance();

const {
    findUsersByUsername,
    insertUsers,
    editUsers,
    fiindAllUsers
} = require('./users.repository')
const getAllUsers = async () => {
    const users = await fiindAllUsers();
    return users;

}
const createUser = async (userData: any) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await insertUsers({
        ...userData,
        password: hashedPassword.toString(),
    });
    return user;

};
const loginUser = async (username: string, password: string) => {
    const user = await findUsersByUsername(username);
    if (!user) {
        throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.userId, role: user.role }, '{process.env.JWT_SECRET_KEY}');
    // Include role in token payload


    try {
        await prisma.Users.update({
            where: { username: user.username },
            data: { token: token },
        }); // Store token in database using Prisma
        console.log("🚀 ~ file: users.service.ts:41 ~ loginUser ~ token:", user.role)
    } catch (error) {
        console.error('Error storing token in database:', error);
        // Handle database error appropriately
    }

    return { token, role: user.role, username: user.username }; // Return both token and role
};

const editUsersByname = async (username: string, userData: any) => {
    await getuserByusername(username);
    const user = await editUsers(username, userData);
    return user;
}
const getuserByusername = async (username: string) => {
    const user = findUsersByUsername(username);
    if (!user) {
        throw new Error(`User ${username} not found`);
    }
    return user;
}

module.exports = {
    createUser,
    loginUser,
    editUsersByname,

    getuserByusername,

    getAllUsers
}