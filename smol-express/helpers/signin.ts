import { Request, Response } from "express"
import { compare } from "bcryptjs"
import { createNewToken, getUserByEmail, updateRefreshTokenId, createNewTokenCache, generateAccessToken, generateRefreshToken } from "../../smol-core"

export const signinHelper = async (req: Request, res: Response, useCache: boolean) => {
    const { email, password } = req.body
    // Check db for email 
    const userData = await getUserByEmail(email)
    if (userData) {
        // cross check password
        if (await compare(password, userData.password)) {
            // Get data from db
            const { role, auth_id } = (await getUserByEmail(email))
            const tokenData = {
                authId: auth_id,
                role
            }
            // Generate new tokens with the id & role
            const accessToken = generateAccessToken(tokenData)
            const refreshToken = generateRefreshToken(tokenData)
            let refreshTokenId: string;
            if (useCache)
                // caching the refresh token in redis
                refreshTokenId = await createNewTokenCache(refreshToken);
            else
                // Store refresh token in db
                refreshTokenId = await createNewToken(refreshToken);

            // Update user with the new refresh token
            await updateRefreshTokenId(auth_id, refreshTokenId)

            // Setup cookie with tokens
            const cookieValue = { accessToken, refreshTokenId }
            res.cookie('authData', JSON.stringify(cookieValue), {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 86400000),
                path: '/',
            });
            return res.json({ success: true })
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
