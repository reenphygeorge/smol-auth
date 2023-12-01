import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import posts from './data';
import { validateUser, smol } from 'smol-auth-express';

const app: Application = express();

dotenv.config();
app.use(express.json());

const smolConfig = {
    connectionUrl: process.env.DB_URL as string,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    clientDomain: process.env.WEBSITE_DOMAIN as string
}

smol()
    .addRoles({
        admin: '*',
        user: [{ route: '/posts', method: '*' }],
        clerk: [{ route: '/posts', method: ['GET'] }],
        viewer: [{ route: '/posts', method: ['GET', 'POST'] }]
    }, { defaultRole: 'admin' })
    .init(app, smolConfig)

app.get('/', (_: Request, res: Response) => {
    res.json({ status: 'running' });
});

app.get('/posts', validateUser, (req: Request, res: Response) => {
    res.send(posts.filter((post) => (post.email === req.body.email)))
});

app.listen(process.env.API_PORT, () => {
    return console.log(`Express is listening at ${process.env.API_PORT}`);
});