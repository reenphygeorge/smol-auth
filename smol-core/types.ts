import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

// DB Types
interface Schema {
    user: User
    tokenStore: TokenStore
}

interface User {
    id: Generated<number>;
    auth_id: string;
    email: string;
    password: string;
    role: string;
    refreshTokenId: string;
    created_at: ColumnType<Date, string | undefined, never>
}

interface TokenStore {
    id: Generated<number>;
    tokenId: string;
    token: string;
}

type NewUser = Insertable<User>
type UpdateUserData = Updateable<User>
type ViewUser = Selectable<User>

type NewToken = Insertable<TokenStore>
type ViewToken = Selectable<TokenStore>

// Other Types

type TokenData = {
    authId: string;
    role: string;
}

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

export {
    Schema,
    User,
    TokenStore,
    NewUser,
    UpdateUserData,
    ViewUser,
    NewToken,
    ViewToken,
    TokenData,
    RbacRules,
    RouteSpec,
    DefaultRole,
    Methods
}