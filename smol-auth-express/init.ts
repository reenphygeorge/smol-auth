import { Application } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { tokenDbInit, userDbInit, rbacInit, DefaultRole, RbacRules, SmolConfig } from "../smol-auth-core";
import { injectRbacRoutes, injectRoutes } from "./index";

// Global config to be used in all other parts where envs are required 
let globalConfig: SmolConfig = {
    accessTokenSecret: '',
    clientDomain: '',
    connectionUrl: '',
    refreshTokenSecret: ''
};
class SmolAuth {
    public __rbacInitialized: boolean = false;

    addRoles(rbacRules: RbacRules, defaultRole: DefaultRole): SmolAuth {
        this.__rbacInitialized = true;
        // Initialize roles (default and rules provided)
        rbacInit(rbacRules, defaultRole)
        return this;
    }

    execute(app: Application, smolConfig: SmolConfig): void {
        globalConfig = smolConfig;
        // Initialize cookie parser and cors
        app.use(cookieParser())
        app.use(cors({
            origin: `http://${smolConfig.clientDomain}`,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        }))
        // User & Auth Data 
        userDbInit(smolConfig.connectionUrl);
        tokenDbInit()
        injectRoutes(app)

        // RBAC
        if (this.__rbacInitialized)
            injectRbacRoutes(app)
    }
}

const smol = (): SmolAuth => {
    return new SmolAuth();
};

export { smol, globalConfig }