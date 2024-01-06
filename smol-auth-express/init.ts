import { Application } from "express";
import cookieParser from 'cookie-parser';
import { tokenDbInit, userDbInit, rbacInit, DefaultRole, RbacRules, SmolConfig } from "smol-auth-core";
import { injectRbacRoutes, injectRoutes } from "./index";

// Global config to be used in all other parts where envs are required 
let globalConfig: SmolConfig = {
    accessTokenSecret: '',
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

    init(app: Application, smolConfig: SmolConfig): void {
        globalConfig = smolConfig;
        app.use(cookieParser())
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