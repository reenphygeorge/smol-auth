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
};

type UserDataResponse = {
    success: boolean;
    data?: UserData;
}

type UserData = {
    email: string;
    password: string;
}

type RoleDataResponse = {
    success: boolean;
    data?: RoleData;
}

type RoleData = {
    role: string
}

declare class SmolAuth {
    public __rbacInitialized: boolean;
    addRoles(rbacRules: RbacRules, defaultRole: DefaultRole): SmolAuth;
    init(app: Application, smolConfig: SmolConfig): void;
}

export const smol: () => SmolAuth;
export let globalConfig: SmolConfig;
export const validateUser: RequestHandler;