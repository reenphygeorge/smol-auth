import { ColumnType, Generated, Insertable, Selectable } from 'kysely'

export interface Schema {
    user: User
}

export interface User {
    id: Generated<number>;
    auth_id: string;
    email: string;
    password: string;
    refreshTokenId: string;
    created_at: ColumnType<Date, string | undefined, never>
}

export type newUser = Insertable<User>
export type viewUser = Selectable<User>