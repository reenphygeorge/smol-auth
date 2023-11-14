import { Request, Response } from "express"
import { createNewToken, getUserByEmail, updateRefreshTokenId } from "../../smol-core/db"
import { compare } from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "../../smol-core/auth"
import { createNewTokenCache } from "../../smol-core/caching"

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
