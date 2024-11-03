import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import chai from 'chai';

const chaiAsPromised = require('chai-as-promised');
const { PrismaClient, PrismaClientOptions } = require('@prisma/client');
const prisma = new PrismaClient();
chai.use(chaiAsPromised);
import jwt from 'jsonwebtoken';
const db = require('../libs/db'); // Adjust the path accordingly
const {
    createUser,
    loginUser,
    editUsersByname,
    getuserByusername,
    getAllUsers,
} = require('../path/to/users.service'); // Adjust the path accordingly
const {
    findUsersByUsername,
    insertUsers,
    editUsers,
    fiindAllUsers,
} = require('../..src/users/users.repository'); // Adjust the path accordingly

describe('User  Service', () => {
    let prismaMock: any;

    beforeEach(() => {
        prismaMock = {
            Users: {
                update: sinon.stub(),
            },
        };
        sinon.stub(db, 'getInstance').returns(prismaMock);
        sinon.stub(bcrypt, 'hash');
        sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('createUser ', () => {
        it('should create a new user with hashed password', async () => {
            const userData = { username: 'testuser', password: 'password' };
            const hashedPassword = 'hashedPassword';
            const hashStub = sinon.stub(bcrypt, 'hash') as sinon.SinonStub;
            hashStub.resolves(hashedPassword);
            (insertUsers as sinon.SinonStub).resolves({ ...userData, password: hashedPassword });

            const user = await createUser(userData);
            expect(user).to.deep.equal({ ...userData, password: hashedPassword });
            expect(hashStub.calledOnceWith(userData.password, 10)).to.be.true;
        });
    });

    describe('UserRepository - loginUser', () => {
        let prismaStub: sinon.SinonStubbedInstance<typeof PrismaClient>;
        let bcryptStub: sinon.SinonStub;
        let jwtStub: sinon.SinonStub;

        beforeEach(() => {
            prismaStub = sinon.stub(prisma, 'Users' as keyof typeof PrismaClient); // Correctly stub Prisma.Users
            bcryptStub = sinon.stub(bcrypt, 'compare');
            jwtStub = sinon.stub(jwt, 'sign');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should throw an error if user not found', async () => {
            prismaStub.findUnique.resolves(null);

            try {
                await loginUser('nonexistentuser', 'password');
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.message).to.equal('User not found');

            }
        });

        it('should throw an error if password is invalid', async () => {
            const mockUser = { userId: 1, username: 'testuser', password: 'hashedPassword' };
            prismaStub.findUnique.resolves(mockUser);
            bcryptStub.resolves(false);

            try {
                await loginUser('testuser', 'wrongpassword');
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.message).to.equal('Invalid password');
            }
        });

        it('should generate a JWT token and update the user with the token', async () => {
            const mockUser = { userId: 1, username: 'testuser', password: 'hashedPassword', role: 'admin' };
            const mockToken = 'testtoken';
            prismaStub.findUnique.resolves(mockUser);
            bcryptStub.resolves(true);
            jwtStub.returns(mockToken);
            prismaStub.update.resolves(mockUser); // Assume update returns the updated user

            const result = await loginUser('testuser', 'password');

            expect(prismaStub.findUnique.calledOnceWith({ where: { username: 'testuser' } })).to.be.true;
            expect(bcryptStub.calledOnceWith('password', 'hashedPassword')).to.be.true;
            expect(jwtStub.calledOnceWith({ userId: 1, role: 'admin' }, '{process.env.JWT_SECRET_KEY}')).to.be.true;
            expect(prismaStub.update.calledOnceWith({ where: { username: 'testuser' }, data: { token: mockToken } })).to.be.true;
            expect(result).to.deep.equal({ token: mockToken, role: 'admin', username: 'testuser' });
        });
    });

    describe('UserRepository - editUsersByname', () => {
        let getuserByusernameStub: sinon.SinonStub;
        let editUsersStub: sinon.SinonStub;

        beforeEach(() => {
            getuserByusernameStub = sinon.stub(getuserByusername);
            editUsersStub = sinon.stub(editUsers);
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should call getuserByusername and editUsers, and return the updated user', async () => {
            const mockUser = { userId: 1, username: 'testuser', password: 'hashedPassword' };
            const mockUpdatedUser = { ...mockUser, name: 'Updated Name' };
            const mockUsername = 'testuser';
            const mockUserData = { name: 'Updated Name' };

            getuserByusernameStub.resolves(mockUser);
            editUsersStub.resolves(mockUpdatedUser);

            const updatedUser = await editUsersByname(mockUsername, mockUserData);

            expect(getuserByusernameStub.calledOnceWith(mockUsername)).to.be.true;
            expect(editUsersStub.calledOnceWith(mockUsername, mockUserData)).to.be.true;
            expect(updatedUser).to.deep.equal(mockUpdatedUser);
        });

        it('should throw an error if getuserByusername throws an error', async () => {
            const mockUsername = 'testuser';
            const mockUserData = { name: 'Updated Name' };

            getuserByusernameStub.rejects(new Error(`User ${mockUsername} not found`));

            try {
                await editUsersByname(mockUsername, mockUserData);
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.message).to.equal(`User ${mockUsername} not found`);
            }
        });
    });

    describe('UserRepository - getuserByusername', () => {
        let findUsersByUsernameStub: sinon.SinonStub;

        beforeEach(() => {
            findUsersByUsernameStub = sinon.stub(findUsersByUsername);
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should call findUsersByUsername and return the user if found', async () => {
            const mockUser = { userId: 1, username: 'testuser', password: 'hashedPassword' };
            const mockUsername = 'testuser';

            findUsersByUsernameStub.resolves(mockUser);

            const user = await getuserByusername(mockUsername);

            expect(findUsersByUsernameStub.calledOnceWith(mockUsername)).to.be.true;
            expect(user).to.deep.equal(mockUser);
        });

        it('should throw an error if user not found', async () => {
            const mockUsername = 'nonexistentuser';

            findUsersByUsernameStub.resolves(null);

            try {
                await getuserByusername(mockUsername);
                expect.fail('Should have thrown an error');
            } catch (error: any) {
                expect(error.message).to.equal(`User ${mockUsername} not found`);
            }
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [{ username: 'user1' }, { username: 'user2' }];
            (fiindAllUsers as sinon.SinonStub).resolves(users);

            const result = await getAllUsers();
            expect(result).to.deep.equal(users);
            expect(fiindAllUsers.calledOnce).to.be.true;
        });
    });
});