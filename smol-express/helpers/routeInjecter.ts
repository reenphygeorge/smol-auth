import { Application } from "express";
import { roleUpdater, signin, signinNoCache, signout, signoutNoCache, signup, signupNoCache } from "..";

const injectRoutes = (app: Application) => {
    app.post('/signup', signup);
    app.post('/signin', signin);
    app.post('/signout', signout);
}

const injectNoCacheRoutes = (app: Application) => {
    app.post('/signup', signupNoCache);
    app.post('/signin', signinNoCache);
    app.post('/signout', signoutNoCache);
}

const injectRbacRoutes = (app: Application) => {
    app.post('/updateRole', roleUpdater)
}
export { injectRoutes, injectNoCacheRoutes, injectRbacRoutes }