import { Application } from "express";
import { roleUpdater, signin, signout, signup } from "../index";

const injectRoutes = (app: Application) => {
    app.post('/signup', signup);
    app.post('/signin', signin);
    app.post('/signout', signout);
}

const injectRbacRoutes = (app: Application) => {
    app.post('/updateRole', roleUpdater)
}
export { injectRoutes, injectRbacRoutes }