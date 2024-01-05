import { NextFunction, Request, Response } from "express"
import { JwtPayload, verify } from "jsonwebtoken"
import { getTokenById, removeToken, updateRefreshTokenId, getUser } from "smol-auth-core"
import { globalConfig } from "../index";

export const signout = async (req: Request, res: Response, _: NextFunction) => {
    try {
        // Retrieving auth cookie and separate id from it.
        const authCookie = req.cookies.authData;
        if (!authCookie) return res.status(403).json({
            success: false,
            message: 'User Error'
        })

        const refreshTokenId = JSON.parse(authCookie).refreshTokenId
        if (!refreshTokenId) return res.status(403).json({
            success: false,
            message: 'Token Missing'
        })

        let refreshToken: string
        // Fetch refresh token from db
        refreshToken = (await getTokenById(refreshTokenId)).token
        // Verify the jwt token
        verify(refreshToken, globalConfig.refreshTokenSecret, async (err, parsedData: JwtPayload) => {
            if (err) return res.status(403).json({
                success: false,
                message: 'Refresh Token Error'
            })
            // Removing refresh token from db
            removeToken(refreshTokenId)
            // Get current user's refreshTokens from db and filter the current token
            let refreshTokenIdList = JSON.parse((await getUser(parsedData.authId)).refreshTokenId)
            refreshTokenIdList = refreshTokenIdList.filter((tokenId: string) => tokenId !== refreshTokenId);

            // Remove refresh token from db
            updateRefreshTokenId(parsedData.authId, JSON.stringify(refreshTokenIdList))
            // Remove auth cookie from client
            res.clearCookie('authData')
            return res.json({ "success": true, message: 'Goodbye!' })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Signout unsuccessful!'
        })
    }
}