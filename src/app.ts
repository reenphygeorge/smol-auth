import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import posts from './data';
import { smol } from '../smol-express';
import { validateUser } from '../smol-express';
import { SmolConfig } from '../smol-core';

const app: Application = express();

dotenv.config();
app.use(express.json());

const smolConfig: SmolConfig = {
    connectionUrl: process.env.DB_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    clientDomain: process.env.WEBSITE_DOMAIN
}

smol()
    .addCache(process.env.REDIS_URL)
    .addRoles({
        admin: '*',
        user: [{ route: '/post', method: '*' }],
        clerk: [{ route: '/posts', method: ['GET'] }],
        viewer: [{ route: '/posts', method: ['GET', 'POST'] }]
    }, { defaultRole: 'admin' })
    .execute(app, smolConfig)

app.get('/', (_: Request, res: Response) => {
    res.json({ status: 'running' });
});

app.get('/posts', validateUser, (req: Request, res: Response) => {
    res.send(posts.filter((post) => (post.email === req.body.email)))
});

app.listen(process.env.API_PORT, () => {
    return console.log(`Express is listening at ${process.env.API_PORT}`);
});