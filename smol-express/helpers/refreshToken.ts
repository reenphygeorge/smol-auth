import { JwtPayload, verify } from "jsonwebtoken"
import { getTokenByIdCache, getTokenById, generateAccessToken, RefreshTokenCookie } from "../../smol-core"
import { globalConfig } from ".."

export const refreshTokenHelper = async (refreshTokenId: string): Promise<RefreshTokenCookie> => {

    let refreshToken: string
    let refreshTokenCookie: RefreshTokenCookie

    // Cross check tokens with the ones in cache
    refreshToken = await getTokenByIdCache(refreshTokenId)

    if (!refreshToken)
        // Cross check tokens with the ones in db
        refreshToken = (await getTokenById(refreshTokenId)).token

    verify(refreshToken, globalConfig.refreshTokenSecret, (err, parsedData: JwtPayload) => {

        // Error return value
        if (err) refreshTokenCookie = {
            success: false,
            cookieValue: '',
            authId: '',
            role: ''
        }

        // cookie data
        else {
            const tokenData = { authId: parsedData.authId, role: parsedData.role }
            const accessToken = generateAccessToken(tokenData)
            const cookieValue = JSON.stringify({ accessToken, refreshTokenId })
            refreshTokenCookie = { success: true, cookieValue, ...tokenData }
        }
    })
    return refreshTokenCookie
}