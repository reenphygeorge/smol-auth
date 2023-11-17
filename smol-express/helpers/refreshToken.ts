import { Request, Response } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import { getTokenByIdCache, getTokenById, generateAccessToken } from "../../smol-core"

export const refreshTokenHelper = async (req: Request, res: Response, useCache: boolean) => {
    // Retrieving auth cookie and separate id from it.
    const authCookie = JSON.parse(req.cookies.authData);
    const refreshTokenId = authCookie && authCookie.refreshTokenId
    if (!refreshTokenId) return res.status(403).json({
        success: false,
        message: 'Token Missing'
    })

    let refreshToken: string
    if (useCache)
        // Cross check tokens with the ones in cache
        refreshToken = await getTokenByIdCache(refreshTokenId)
    else {
        // Cross check tokens with the ones in db
        refreshToken = (await getTokenById(refreshTokenId)).token
    }

    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, parsedData: JwtPayload) => {
        if (err) return res.status(403).json({
            success: false,
            message: 'Refresh Token Error'
        })
        const tokenData = { authId: parsedData.authId, role: parsedData.role }
        const accessToken = generateAccessToken(tokenData)
        const cookieValue = { accessToken, refreshTokenId }
        res.cookie('authData', JSON.stringify(cookieValue), {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 86400000),
            path: '/',
        });
        return res.json({ success: true })
    })
}