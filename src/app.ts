import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import posts from './data';

import { validateUser } from '../smol-express/middleware';
import { smol } from '../smol-express/routes';

const app: Application = express();

dotenv.config();
app.use(express.json());

smol()
    .addRoles({
        admin: ['/add', 'delete'],
        user: ['/view', 'edit'],
    })
    .addCache('redis://:@localhost:6379')
    .execute(app, 'data2.db')

app.get('/', (_: Request, res: Response) => {
    res.json({ status: 'running' });
});

app.get('/posts', validateUser, (req: Request, res: Response) => {
    res.send(posts.filter((post) => (post.email === req.body.email)))
});

app.listen(process.env.API_PORT, () => {
    return console.log(`Express is listening at ${process.env.API_PORT}`);
});