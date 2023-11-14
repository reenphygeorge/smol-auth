type RbacRules = {
    [key: string]: RouteSpec[] | '*';
}

type RouteSpec = {
    route: string;
    method: '*' | Methods[]
}

type DefaultRole = {
    defaultRole: string;
}

type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

let __rbacRules: RbacRules
let __defaultRole: string

const rbacInit = (rbacRules: RbacRules, { defaultRole }: DefaultRole) => {
    __rbacRules = rbacRules;
    __defaultRole = defaultRole
}

export { rbacInit, __rbacRules, __defaultRole }