import { Application, RequestHandler } from 'express';

type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RouteSpec = {
    route: string;
    method: '*' | Methods[];
};

type RbacRules = {
    [key: string]: RouteSpec[] | '*';
};

type DefaultRole = {
    defaultRole: string;
};

type SmolConfig = {
    connectionUrl: string;
    accessTokenSecret: string;
    refreshTokenSecret: string;
    clientDomain: string;
};

declare class SmolAuth {
    public __cacheInitialized: boolean;
    public __rbacInitialized: boolean;

    addCache(redisUrl: string): SmolAuth;
    addRoles(rbacRules: RbacRules, defaultRole: DefaultRole): SmolAuth;
    execute(app: Application, smolConfig: SmolConfig): void;
}

export const smol: () => SmolAuth;
export let globalConfig: SmolConfig;
export const validateUser: RequestHandler;