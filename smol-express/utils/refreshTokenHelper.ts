import { Request, Response } from "express"
import { getTokenByIdCache } from "../../smol-core/caching"
import { getTokenById } from "../../smol-core/db"
import { JwtPayload, verify } from "jsonwebtoken"
import { generateAccessToken } from "../../smol-core/auth"

export const refreshTokenHelper = async (req: Request, res: Response, useCache: boolean) => {
    const authHeader = req.headers['authorization']
    const refreshTokenId = authHeader && authHeader.split(' ')[1]
    if (!refreshTokenId) return res.status(403).json({
        success: false,
        message: 'Token Missing'
    })

    let refreshToken: string
    if (useCache)
        // Cross check tokens with the ones in cache
        refreshToken = await getTokenByIdCache(refreshTokenId)
    else
        // Cross check tokens with the ones in db
        refreshToken = (await getTokenById(refreshTokenId)).token

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