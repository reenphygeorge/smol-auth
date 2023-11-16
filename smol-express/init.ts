import { Application } from "express";
import { cacheInit, tokenDbInit, userDbInit, rbacInit, DefaultRole, RbacRules } from "../smol-core";
import { injectNoCacheRoutes, injectRbacRoutes, injectRoutes } from ".";

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

    execute(app: Application, userdbPath: string): void {
        // User & Auth Data 
        userDbInit(userdbPath);
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

export { smol }