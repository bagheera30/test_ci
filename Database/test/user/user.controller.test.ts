import express from 'express';
import request from 'supertest';
import sinon from 'sinon';
import { expect } from 'chai';
const router = express.Router();
const usersRouter = router;
const {
    createUser,
    loginUser,
    editUsersByname,
    getAllUsers,
    getuserByusername,
} = require('../../src/users/users.controller'); // Adjust the path accordingly

// Create an instance of the Express app
const app = express();
app.use(express.json());
app.use('/', usersRouter);

describe('Users Router', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('GET /', () => {
        it('should fetch all users', async () => {
            const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
            sinon.stub(getAllUsers).resolves(mockUsers);

            const res = await request(app).get('/');
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mockUsers);
        });

        it('should handle errors', async () => {
            sinon.stub(getAllUsers).rejects(new Error('Error fetching users'));

            const res = await request(app).get('/');
            expect(res.status).to.equal(500);
            expect(res.body).to.deep.equal({ message: 'Error fetching users' });
        });
    });

    describe('GET /:username', () => {
        it('should fetch a user by username', async () => {
            const mockUser = { username: 'user1', name: 'User  One' };
            sinon.stub(getuserByusername).resolves(mockUser);

            const res = await request(app).get('/user1');
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(mockUser);
        });

        it('should handle user not found', async () => {
            sinon.stub(getuserByusername).rejects(new Error('User  user1 not found'));

            const res = await request(app).get('/user1');
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('User  user1 not found');
        });
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            const newUser = { username: 'newuser', password: 'password' };
            const createdUser = { ...newUser, userId: 1 };
            sinon.stub(createUser).resolves(createdUser);

            const res = await request(app).post('/register').send(newUser);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ data: createdUser, message: 'register success' });
        });

        it('should handle registration errors', async () => {
            sinon.stub(createUser).rejects(new Error('Registration failed'));

            const res = await request(app).post('/register').send({});
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Registration failed');
        });
    });

    describe('POST /login', () => {
        it('should log in a user and return a token', async () => {
            const loginData = { username: 'testuser', password: 'password' };
            const loginResponse = { token: 'jwtToken', role: 'user', username: 'testuser' };
            sinon.stub(loginUser).resolves(loginResponse);

            const res = await request(app).post('/login').send(loginData);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal(loginResponse);
        });

        it('should handle login errors', async () => {
            sinon.stub(loginUser).rejects(new Error('Invalid credentials'));

            const res = await request(app).post('/login').send({ username: 'wronguser', password: 'wrongpassword' });
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Invalid credentials');
        });
    });

    describe('PUT /:username', () => {
        it('should edit a user by username', async () => {
            const username = 'user1';
            const userData = { name: 'Updated User One', nomerWA: '1234567890' };
            const updatedUser = { ...userData, username };
            sinon.stub(editUsersByname).resolves(updatedUser);

            const res = await request(app).put(`/${username}`).send(userData);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ data: updatedUser, message: 'edit product success' });
        });

        it('should handle missing fields', async () => {
            const res = await request(app).put('/user1').send({ name: 'Updated User One' });
            expect(res.status).to.equal(400);
            expect(res.text).to.equal('Some fields are missing');
        });
    });

    describe('PATCH /:username', () => {
        it('should partially edit a user by username', async () => {
            const username = 'user1';
            const userData = { name: 'Updated User One' };
            const updatedUser = { ...userData, username };
            sinon.stub(editUsersByname).resolves(updatedUser);

            const res = await request(app).patch(`/${username}`).send(userData);
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal({ data: updatedUser, message: 'edit product success' });
        });
    });
});