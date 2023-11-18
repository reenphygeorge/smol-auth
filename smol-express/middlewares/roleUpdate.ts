import { NextFunction, Request, Response } from "express";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { getUser, updateRefreshTokenId, updateUser, generateAccessToken, generateRefreshToken, __rbacRules } from "../../smol-core";
import { refreshTokenHelper } from "../helpers/refreshToken";

export const roleUpdater = (req: Request, res: Response, _: NextFunction) => {
    // Check if given role is already configured
    const { role } = req.body
    if (!__rbacRules.hasOwnProperty(role))
        return res.status(403).json({
            success: false,
            message: 'Illegal Role'
        })

    // Retrieving auth headers and separate id from it.
    const authCookie = JSON.parse(req.cookies.authData);
    const accessToken = authCookie && authCookie.accessToken
    const cookieRefreshTokenId = authCookie && authCookie.refreshTokenId

    // Throw if tokens are missing
    if (!accessToken || !cookieRefreshTokenId) {
        return res.status(403).json({
            success: false,
            message: 'Token Missing'
        });
    }

    // Verify the access token
    verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, parsedData: JwtPayload) => {

        // Global token data
        let __authId: string
        let __role: string


        if (err) {
            // Access token expired -> Generate new token with the provided refresh token and pass it via cookie
            if (err instanceof TokenExpiredError) {
                // get updated cookie with new access token after verification 
                const { success, cookieValue, authId } = await refreshTokenHelper(cookieRefreshTokenId)
                // error with refresh token -> clear cookie and will signout user
                if (!success)
                    return res.status(403).json({ success: false, message: 'Refresh Token Error' });

                __authId = authId
                __role = role

                // generate cookie with the provided data
                res.cookie('authData', JSON.stringify(cookieValue), {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 86400000),
                    path: '/',
                });
            } else {
                // Some other error with token -> signout user
                res.clearCookie('authData')
                return res.status(403).json({ success: false, message: 'Validation Error' });
            }
        }
        else {
            // Update with values parsed from access token
            __authId = parsedData.authId
            __role = parsedData.role
        }

        // Permission checking
        const data = await getUser(__authId)
        if (!data) {
            // user data not found -> Signouts user
            res.clearCookie('authData')
            return res.status(403).json({
                success: false,
                message: 'Auth Token Error'
            })
        }

        // Update user with new role and return updated cookie 
        data.role = role
        const accessToken = generateAccessToken({ authId: __authId, role })
        const refreshToken = generateRefreshToken({ authId: __authId, role })
        const refreshTokenId = await updateRefreshTokenId(__authId, refreshToken)
        await updateUser(__authId, data)
        const cookieValue = { accessToken, refreshTokenId }
        res.cookie('authData', JSON.stringify(cookieValue), {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 86400000),
            path: '/',
        });
        return res.json({ success: true, message: `Role updated to ${data.role}` })
    })
}