import { Schema, newUser } from './types'
import Database from 'better-sqlite3';
import { Kysely, SqliteDialect, sql } from 'kysely'

let db: Kysely<Schema>

const dbInit = async (userdbPath: string) => {
    try {
        const dialect = new SqliteDialect({
            database: new Database(userdbPath),
        })

        db = new Kysely<Schema>({
            dialect,
        })
        await db.schema.createTable('user')
            .addColumn('id', 'integer', (cb) => cb.primaryKey().autoIncrement().notNull())
            .addColumn('auth_id', 'varchar(50)', (cb) => cb.notNull())
            .addColumn('email', 'varchar(50)', (cb) => cb.notNull())
            .addColumn('password', 'varchar(50)')
            .addColumn('refreshTokenId', 'varchar(50)')
            .addColumn('created_at', 'timestamptz', (cb) =>
                cb.notNull().defaultTo(sql`current_timestamp`)
            )
            .execute()
    } catch { }
}

const createUser = async (user: newUser) => {
    await db.insertInto('user')
        .values(user)
        .returningAll()
        .executeTakeFirstOrThrow()
}

const updateRefreshTokenId = async (email: string, refreshTokenId: string) => {
    await db
        .updateTable('user')
        .set({
            refreshTokenId,
        })
        .where('email', '=', email)
        .executeTakeFirst()
}

const getUserByEmail = async (email: string) => {
    return await db.selectFrom('user')
        .where('email', '=', email)
        .selectAll()
        .executeTakeFirst()
}

export { dbInit, createUser, getUserByEmail, updateRefreshTokenId }