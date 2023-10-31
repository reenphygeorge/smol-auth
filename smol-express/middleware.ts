import { JwtPayload, TokenExpiredError, verify } from 'jsonwebtoken';
import { createNewToken, getRefreshTokens, removeToken } from '../smol-core/caching';
import { NextFunction, Request, Response } from 'express';
import { createUser, getUserByEmail, updateRefreshTokenId } from '../smol-core/db';
import { compare, hash } from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../smol-core/auth';
import { createId } from '@paralleldrive/cuid2';

function validateUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.status(403).json({
        success: false,
        message: 'Token Missing'
    })
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, parsedData: JwtPayload) => {
        if (err) {
            if (err instanceof TokenExpiredError)
                return res.status(403).json({ success: false, message: 'Token Expired' })
            else
                return res.status(403).json({ success: false, message: 'Validation Error' })
        }
        req.body.email = parsedData.email;
        next()
    })
}

async function signupUser(req: Request, res: Response, _: NextFunction) {
    const { email, password } = req.body
    if (!(await getUserByEmail(email))) {
        // Store email and password (encrypted) in db and proceed.
        const tokenData = { email }
        const encryptedPassword: string = await hash(password, 10)
        const accessToken = generateAccessToken(tokenData)
        const refreshToken = generateRefreshToken(tokenData)

        const refreshTokenId = await createNewToken(refreshToken) // caching the refresh token in redis
        // store refresh token in db
        createUser({ auth_id: createId(), email, password: encryptedPassword, refreshTokenId })
        return res.json({ success: true, accessToken, refreshTokenId })
    }
    return res.status(403).json({
        success: false,
        message: 'User Exists'
    })
}

async function signinUser(req: Request, res: Response, _: NextFunction) {
    const { email, password } = req.body
    // Check db for email 
    const userData = await getUserByEmail(email)
    if (userData) {
        // cross check password
        if (await compare(password, userData.password)) {
            const tokenData = { email }

            const accessToken = generateAccessToken(tokenData)
            const refreshToken = generateRefreshToken(tokenData)
            // caching the refresh token in redis
            const refreshTokenId = await createNewToken(refreshToken)
            await updateRefreshTokenId(email, refreshTokenId)
            return res.json({ success: true, accessToken, refreshTokenId })
        }
        return res.status(403).json({
            success: false,
            message: 'Wrong Password'
        })
    }
    return res.status(404).json({
        success: false,
        message: 'User Not Found'
    })
}

async function refreshToken(req: Request, res: Response, _: NextFunction) {
    const authHeader = req.headers['authorization']
    const refreshTokenId = authHeader && authHeader.split(' ')[1]
    if (!refreshTokenId) return res.status(403).json({
        success: false,
        message: 'Token Missing'
    })
    // Cross check tokens with the ones in cache
    const refreshToken = await getRefreshTokens(refreshTokenId)
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, parsedData: JwtPayload) => {
        if (err) return res.status(403).json({
            success: false,
            message: 'Refresh Token Error'
        })
        const tokenData = { email: parsedData.email }
        const accessToken = generateAccessToken(tokenData)
        return res.json({ success: true, accessToken })
    })
}

async function signoutUser(req: Request, res: Response, _: NextFunction) {
    // Retrieving auth headers and separate id from it.
    const authHeader = req.headers['authorization']
    const refreshTokenId = authHeader && authHeader.split(' ')[1]
    if (!refreshTokenId) return res.status(403).json({
        success: false,
        message: 'Token Missing'
    })
    // Fetch refresh token from redis
    const refreshToken = await getRefreshTokens(refreshTokenId)
    // Verify the jwt token
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, parsedData: JwtPayload) => {
        if (err) return res.status(403).json({
            success: false,
            message: 'Refresh Token Error'
        })
        // Removing cached refresh token from redis
        removeToken(refreshTokenId)
        // Remove refresh token from db
        updateRefreshTokenId(parsedData.email, refreshTokenId)
        return res.json({ "success": true, message: 'bye' })
    })
}


export { validateUser, signupUser, signinUser, refreshToken, signoutUser }