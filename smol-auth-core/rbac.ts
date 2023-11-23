import { DefaultRole, RbacRules } from ".";

let __rbacRules: RbacRules
let __defaultRole: string

const rbacInit = (rbacRules: RbacRules, { defaultRole }: DefaultRole) => {
    __rbacRules = rbacRules;
    __defaultRole = defaultRole
}

export { rbacInit, __rbacRules, __defaultRole }