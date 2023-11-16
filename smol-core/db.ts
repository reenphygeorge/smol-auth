import { createId } from '@paralleldrive/cuid2';
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect, sql } from 'kysely'
import { Schema, UpdateUserData, NewToken, NewUser } from '.'

let db: Kysely<Schema>

// --- User Data ---

// Initialize user table in db
const userDbInit = async (userDBPath: string) => {
    try {
        const dialect = new SqliteDialect({
            database: new Database(userDBPath),
        })

        db = new Kysely<Schema>({
            dialect,
        })
        await db.schema.createTable('user')
            .addColumn('id', 'integer', (cb) => cb.primaryKey().autoIncrement().notNull())
            .addColumn('auth_id', 'varchar(50)', (cb) => cb.notNull())
            .addColumn('email', 'varchar(50)', (cb) => cb.notNull())
            .addColumn('password', 'varchar(50)')
            .addColumn('role', 'varchar(50)')
            .addColumn('refreshTokenId', 'varchar(50)')
            .addColumn('created_at', 'timestamptz', (cb) =>
                cb.notNull().defaultTo(sql`current_timestamp`)
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
        .where('auth_id', '=', authId)
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
        .where('auth_id', '=', authId)
        .selectAll()
        .executeTakeFirst()
}

const updateUser = async (authId: string, user: UpdateUserData) => {
    return await db
        .updateTable('user')
        .set({
            ...user
        })
        .where('auth_id', '=', authId)
        .executeTakeFirst()
}

// --- Refresh Token inside sqlite: No cache mode ---

// Initialize token table in db
const tokenDbInit = async (dbPath: string) => {
    try {
        const dialect = new SqliteDialect({
            database: new Database(dbPath),
        })

        db = new Kysely<Schema>({
            dialect,
        })
        await db.schema.createTable('tokenStore')
            .addColumn('id', 'integer', (cb) => cb.primaryKey().autoIncrement().notNull())
            .addColumn('tokenId', 'varchar(50)', (cb) => cb.notNull())
            .addColumn('token', 'varchar(100)', (cb) => cb.notNull())
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