import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import posts from './data';
import { validateUser, validateRefreshToken, validateLogoutToken } from './middlewares/verifyUser';
import { generateAccessToken, generateRefreshToken } from './auth';
import { addNewToken, removeToken, redisInit } from './redis';

dotenv.config();

const app: Application = express();

redisInit();

app.use(express.json());

app.get('/', (_: Request, res: Response) => {
    res.json({ status: 'running' });
});

app.get('/posts', validateUser, (req: Request, res: Response) => {
    res.send(posts.filter((post) => (post.username === req.body.user.name)))
})

app.post('/signup', (req: Request, res: Response) => {
    const { email, password } = req.body
    // Check db for email exists ? if throw error. else store email and password (encrypted) in db and proceed.
    const userData = { email }
    const accessToken = generateAccessToken(userData)
    const refreshToken = generateRefreshToken(userData)
    // store refresh token in db
    addNewToken(refreshToken) // caching the refresh token in redis
    res.json({ accessToken, refreshToken })
})

app.post('/signin', (req: Request, res: Response) => {
    const { email, password } = req.body
    // Check db for email and cross check password (with bcrypt) 
    const userData = { email }
    const accessToken = generateAccessToken(userData)
    const refreshToken = generateRefreshToken(userData)
    addNewToken(refreshToken) // caching the refresh token in redis
    res.json({ accessToken, refreshToken })
})

app.post('/refresh', validateRefreshToken, (req: Request, res: Response) => {
    const accessToken = generateAccessToken({ name: req.body.user.name })
    res.json({ accessToken })
})

app.post('/logout', validateLogoutToken, (req: Request, res: Response) => {
    // Remove refresh token from db
    removeToken(req.body.token) // Removing cached refresh token from redis
    res.json({ "success": true })
})

app.listen(process.env.PORT, () => {
    return console.log(`Express is listening at ${process.env.PORT}`);
});