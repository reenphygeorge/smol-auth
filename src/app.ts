import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import posts from './data';

import { smol } from '../smol-express';
import { validateUser } from '../smol-express';

const app: Application = express();

dotenv.config();
app.use(express.json());

smol()
    .addCache('redis://:@localhost:6379')
    .addRoles({
        admin: '*',
        user: [{ route: '/post', method: '*' }],
        clerk: [{ route: '/posts', method: ['GET'] }],
        viewer: [{ route: '/posts', method: ['GET','POST'] }]
    }, { defaultRole: 'admin' })
    .execute(app, 'postgres://user:pass@localhost:5432/')

app.get('/', (_: Request, res: Response) => {
    res.json({ status: 'running' });
});

app.get('/posts', validateUser, (req: Request, res: Response) => {
    res.send(posts.filter((post) => (post.email === req.body.email)))
});

app.listen(process.env.API_PORT, () => {
    return console.log(`Express is listening at ${process.env.API_PORT}`);
});