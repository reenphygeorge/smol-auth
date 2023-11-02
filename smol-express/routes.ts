import { Application } from "express";
import { refreshToken, refreshTokenNoCache, signin, signinNoCache, signout, signoutNoCache, signup, signupNoCache } from "./middleware";
import { cacheInit } from "../smol-core/caching";
import { userDbInit, tokenDbInit } from "../smol-core/db";

type Role = {
    [key: string]: RouteSpec[];
}

type RouteSpec = {
    route: string;
    method: '*' | Methods[]
}

type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

class SmolAuth {
    public __cacheInitialized: boolean = false;
    addCache(redisUrl: string): SmolAuth {
        this.__cacheInitialized = true;
        // Initialize cache here
        cacheInit(redisUrl);
        return this;
    }
    addRoles(roles: Role): SmolAuth {
        // TODO: RBAC
        console.log(roles);
        return this;
    }
    execute(app: Application, userdbPath: string): void {
        if (this.__cacheInitialized)
            tokenDbInit(userdbPath)
        userDbInit(userdbPath);
        if (this.__cacheInitialized) {
            app.post('/signup', signup);
            app.post('/signin', signin);
            app.get('/refresh', refreshToken);
            app.post('/signout', signout);
        }
        else {
            app.post('/signup', signupNoCache);
            app.post('/signin', signinNoCache);
            app.get('/refresh', refreshTokenNoCache);
            app.post('/signout', signoutNoCache);
        }
    }
}

const smol = (): SmolAuth => {
    return new SmolAuth();
};

export { smol }