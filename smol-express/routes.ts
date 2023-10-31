import { Application } from "express";
import { refreshToken, signinUser, signoutUser, signupUser } from "./middleware";
import { cacheInit } from "../smol-core/caching";
import { dbInit } from "../smol-core/db";

const smolInit = (app: Application, redisUrl: string, userdbPath: string): void => {

    cacheInit(redisUrl);
    dbInit(userdbPath);

    app.post('/signup', signupUser);

    app.post('/signin', signinUser);

    app.get('/refresh', refreshToken);

    app.post('/signout', signoutUser);
}

export { smolInit }