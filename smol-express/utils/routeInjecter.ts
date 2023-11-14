import { Application } from "express";
import { refreshToken, refreshTokenNoCache, roleUpdater, signin, signinNoCache, signout, signoutNoCache, signup, signupNoCache } from "../middleware";

const injectRoutes = (app: Application) => {
    app.post('/signup', signup);
    app.post('/signin', signin);
    app.get('/refresh', refreshToken);
    app.post('/signout', signout);
}

const injectNoCacheRoutes = (app: Application) => {
    app.post('/signup', signupNoCache);
    app.post('/signin', signinNoCache);
    app.get('/refresh', refreshTokenNoCache);
    app.post('/signout', signoutNoCache);
}

const injectRbacRoutes = (app: Application) => {
    app.post('/updateRole', roleUpdater)
}
export { injectRoutes, injectNoCacheRoutes, injectRbacRoutes }