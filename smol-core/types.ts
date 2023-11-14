import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface Schema {
    user: User
    tokenStore: TokenStore
}

export interface User {
    id: Generated<number>;
    auth_id: string;
    email: string;
    password: string;
    role: string;
    refreshTokenId: string;
    created_at: ColumnType<Date, string | undefined, never>
}

export interface TokenStore {
    id: Generated<number>;
    tokenId: string;
    token: string;
}

export type newUser = Insertable<User>
export type UpdateUserData = Updateable<User>
export type viewUser = Selectable<User>

export type newToken = Insertable<TokenStore>
export type viewToken = Selectable<TokenStore>