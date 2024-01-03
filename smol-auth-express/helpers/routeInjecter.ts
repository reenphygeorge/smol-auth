import { Application } from "express";
import { roleUpdater, signin, signout, signup } from "../index";

const injectRoutes = (app: Application) => {
    app.post('/api/auth/signup', signup);
    app.post('/api/auth/signin', signin);
    app.post('/api/auth/signout', signout);
}

const injectRbacRoutes = (app: Application) => {
    app.post('/api/auth/updateRole', roleUpdater)
}
export { injectRoutes, injectRbacRoutes }