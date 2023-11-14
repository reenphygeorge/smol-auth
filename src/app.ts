import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import posts from './data';

import { validateUser } from '../smol-express/middleware';
import { smol } from '../smol-express/init';

const app: Application = express();

dotenv.config();
app.use(express.json());

smol()
    .addCache('redis://:@localhost:6379')
    .addRoles({
        admin: '*',
        user: [{ route: '/users', method: ['GET'] }, { route: '/devs', method: ['GET'] }],
        clerk: [{ route: '/users', method: '*' }],
        viewer: [{ route: '/users', method: ['GET'] }]
    }, { defaultRole: 'viewer' })
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