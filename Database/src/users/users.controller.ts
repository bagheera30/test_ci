import express, { Request, Response } from "express";
const { createUser, loginUser, editUsersByname, getAllUsers, getuserByusername } = require('./users.service')
const router = express.Router();
const { Jwt } = require("jsonwebtoken");


router.get("/", async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.get('/:username', async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const users = await getuserByusername(username);
        res.json(users);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
})

router.post('/register', async (req: Request, res: Response) => {
    try {
        const newdata = req.body;
        const user = await createUser(newdata);

        res.send({
            data: user,

            message: "register success",
        });
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
});
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;


        const user = await loginUser(username, password); // Retrieve token from loginUser function
        res.cookie('jwt', user.token, { httpOnly: true, secure: true });
        // Store token in session


        res.status(200).json(user);

    } catch (error) {
        res.status(400).send((error as Error).message);
    }
});
router.put('/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    const userData = req.body;

    if (
        !(
            userData.username &&
            userData.name &&
            userData.nomerWA
        )
    ) {
        return res.status(400).send("Some fields are missing");
    }

    const user = await editUsersByname(username, userData)

    res.send({
        data: user,
        message: "edit product success",
    });
});

router.patch('/:username', async (req: Request, res: Response) => {
    const decode = Jwt.decode(req.cookies.jwt, process.env.JWT_SECRET_KEY)
    const usernam = decode.username;
    const userData = req.body;
    const user = await editUsersByname(usernam, userData)
    res.send({
        data: user,
        message: "edit product success",
    })
})

module.exports = router

