import { Application } from "express";
import { cacheInit } from "../smol-core/caching";
import { userDbInit, tokenDbInit } from "../smol-core/db";
import { rbacInit } from "../smol-core/rbac";
import { injectNoCacheRoutes, injectRbacRoutes, injectRoutes } from "./utils/routeInjecter";

type RbacRules = {
    [key: string]: RouteSpec[] | '*';
}

type RouteSpec = {
    route: string;
    method: '*' | Methods[]
}

type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type DefaultRole = {
    defaultRole: string;
}

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
            tokenDbInit(userdbPath)
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