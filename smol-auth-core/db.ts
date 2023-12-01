import { createId } from '@paralleldrive/cuid2';
import { Pool } from 'pg'
import { Kysely, PostgresDialect, sql } from 'kysely'
import { Schema, UpdateUserData, NewToken, NewUser } from '.'

let db: Kysely<Schema>

// --- User Data ---

// Initialize user table in db
const userDbInit = async (connectionUrl: string) => {
    try {
        const dialect = new PostgresDialect({
            pool: new Pool({
                connectionString: connectionUrl
            })
        })

        db = new Kysely<Schema>({
            dialect,
        })
        await db.schema.createTable('user')
            .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
            .addColumn('authId', 'text', (col) => col.notNull())
            .addColumn('email', 'text', (col) => col.notNull())
            .addColumn('password', 'text')
            .addColumn('role', 'text')
            .addColumn('refreshTokenId', 'text')
            .addColumn('createdAt', 'timestamptz', (col) =>
                col.defaultTo(sql`now()`).notNull()
            )
            .execute()
    } catch { }
}

// Create new user while signup
const createUser = async (user: NewUser) => {
    await db.insertInto('user')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow()
}

// Update refresh tokens id in user table while new signin
const updateRefreshTokenId = async (authId: string, refreshTokenId: string) => {
    await db
        .updateTable('user')
        .set({
            refreshTokenId,
        })
        .where('authId', '=', authId)
        .executeTakeFirst()
}

// Get user data by email after signin/signup to get data for updating with authID
const getUserByEmail = async (email: string) => {
    return await db.selectFrom('user')
        .where('email', '=', email)
        .selectAll()
        .executeTakeFirst()
}

const getUser = async (authId: string) => {
    return await db.selectFrom('user')
        .where('authId', '=', authId)
        .selectAll()
        .executeTakeFirst()
}

const updateUser = async (authId: string, user: UpdateUserData) => {
    return await db
        .updateTable('user')
        .set({
            ...user
        })
        .where('authId', '=', authId)
        .executeTakeFirst()
}

// --- Refresh Token inside sqlite: No cache mode ---

// Initialize token table in db
const tokenDbInit = async () => {
    try {
        await db.schema.createTable('tokenStore')
            .addColumn('id', 'serial', (col) => col.primaryKey().notNull())
            .addColumn('tokenId', 'text', (col) => col.notNull())
            .addColumn('token', 'text', (col) => col.notNull())
            .execute()
    } catch { }
}

// Generate a key in db
const createNewToken = async (token: string) => {
    const tokenId = createId();
    const newToken: NewToken = {
        tokenId,
        token
    }
    // Add the values to db and return tokenId
    await db.insertInto('tokenStore')
        .values(newToken)
        .returningAll()
        .executeTakeFirstOrThrow()
    return tokenId;
}

// Get tokens from db
const getTokenById = async (tokenId: string) => {
    return await db.selectFrom('tokenStore')
        .where('tokenId', '=', tokenId)
        .selectAll()
        .executeTakeFirst()
}

// Delete tokens from db
const removeToken = async (tokenId: string) => {
    return await db.deleteFrom('tokenStore')
        .where('tokenId', '=', tokenId)
        .executeTakeFirst()
}

export { userDbInit, tokenDbInit, createUser, getUserByEmail, updateRefreshTokenId, createNewToken, getTokenById, removeToken, updateUser, getUser }