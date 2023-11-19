import { Application } from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { cacheInit, tokenDbInit, userDbInit, rbacInit, DefaultRole, RbacRules, SmolConfig } from "../smol-core";
import { injectNoCacheRoutes, injectRbacRoutes, injectRoutes } from ".";

// Global config to be used in all other parts where envs are required 
let globalConfig: SmolConfig = {
    accessTokenSecret: '',
    clientDomain: '',
    connectionUrl: '',
    refreshTokenSecret: ''
};
class SmolAuth {
    public __cacheInitialized: boolean = false;
    public __rbacInitialized: boolean = false;

    addCache(redisUrl: string): SmolAuth {
        this.__cacheInitialized = true;
        // Initialize redis for caching
        cacheInit(redisUrl);
        return this;
    }

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
        if (this.__cacheInitialized)
            injectRoutes(app)
        else {
            tokenDbInit()
            injectNoCacheRoutes(app)
        }

        // RBAC
        if (this.__rbacInitialized)
            injectRbacRoutes(app)
    }
}

const smol = (): SmolAuth => {
    return new SmolAuth();
};

export { smol, globalConfig }