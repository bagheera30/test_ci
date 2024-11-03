import { expect } from 'chai';
const sinon = require('sinon');
const db = require("../../src/libs/db");
const {
    findAllUsers,
    findUsersByUsername,
    insertUsers,
    editUsers,
} = require("../../../src/users/users.repository");

describe('User  Repository', () => {
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = {
            Users: {
                findMany: sinon.stub(),
                findUnique: sinon.stub(),
                create: sinon.stub(),
                update: sinon.stub(),
            },
        };
        sinon.stub(db, 'getInstance').returns(prismaMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('findAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];
            prismaMock.Users.findMany.resolves(mockUsers);

            const users = await findAllUsers();
            expect(users).to.deep.equal(mockUsers);
            expect(prismaMock.Users.findMany.calledOnce).to.be.true;
        });
    });

    describe('findUsersByUsername', () => {
        it('should return a user by username', async () => {
            const mockUser = { id: 1, username: 'user1' };
            prismaMock.Users.findUnique.resolves(mockUser);

            const user = await findUsersByUsername('user1');
            expect(user).to.deep.equal(mockUser);
            expect(prismaMock.Users.findUnique.calledOnceWith({ where: { username: 'user1' } })).to.be.true;
        });

        it('should return null if user is not found', async () => {
            prismaMock.Users.findUnique.resolves(null);

            const user = await findUsersByUsername('nonexistent');
            expect(user).to.be.null;
            expect(prismaMock.Users.findUnique.calledOnce).to.be.true;
        });
    });

    describe('insertUsers', () => {
        it('should insert a new user', async () => {
            const userData = { name: 'Test User', username: 'testuser', password: 'password', numberWA: '1234567890', token: 'token' };
            const mockUser = { id: 1, ...userData };
            prismaMock.Users.create.resolves(mockUser);

            const user = await insertUsers(userData);
            expect(user).to.deep.equal(mockUser);
            expect(prismaMock.Users.create.calledOnceWith({ data: userData })).to.be.true;
        });
    });

    describe('editUsers', () => {
        it('should edit an existing user', async () => {
            const username = 'testuser';
            const userData = { name: 'Updated User', username: 'testuser', password: 'newpassword', numberWA: '0987654321' };
            const mockUser = { id: 1, ...userData };
            prismaMock.Users.update.resolves(mockUser);

            const user = await editUsers(username, userData);
            expect(user).to.deep.equal(mockUser);
            expect(prismaMock.Users.update.calledOnceWith({ where: { username }, data: userData })).to.be.true;
        });
    });
});