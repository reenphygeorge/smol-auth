import { Request, Response } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import { getTokenById, removeToken, updateRefreshTokenId, getTokenByIdCache, removeTokenCache } from "../../smol-core"

export const signoutHelper = async (req: Request, res: Response, useCache: boolean) => {
    // Retrieving auth cookie and separate id from it.
    const authCookie = JSON.parse(req.cookies.authData);
    const refreshTokenId = authCookie && authCookie.refreshTokenId
    if (!refreshTokenId) return res.status(403).json({
        success: false,
        message: 'Token Missing'
    })
    let refreshToken: string
    if (useCache)
        // Fetch refresh token from redis
        refreshToken = await getTokenByIdCache(refreshTokenId)
    else
        refreshToken = (await getTokenById(refreshTokenId)).token
    // Verify the jwt token
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, parsedData: JwtPayload) => {
        if (err) return res.status(403).json({
            success: false,
            message: 'Refresh Token Error'
        })
        if (useCache)
            // Removing cached refresh token from redis
            removeTokenCache(refreshTokenId)
        else
            // Removing refresh token from db
            removeToken(refreshTokenId)
        // Remove refresh token from db
        updateRefreshTokenId(parsedData.authId, '')
        // Remove auth cookie from client
        res.clearCookie('authData')
        return res.json({ "success": true, message: 'bye' })
    })
}