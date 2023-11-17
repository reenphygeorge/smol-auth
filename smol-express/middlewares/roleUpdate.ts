import { NextFunction, Request, Response } from "express";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { getUser, updateRefreshTokenId, updateUser, generateAccessToken, generateRefreshToken, __rbacRules } from "../../smol-core";

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

    verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, parsedData: JwtPayload) => {
        if (err) {
            if (err instanceof TokenExpiredError) {
                return res.status(403).json({ success: false, message: 'Token Expired' });
            } else {
                return res.status(403).json({ success: false, message: 'Validation Error' });
            }
        }
        const { authId } = parsedData
        const data = await getUser(authId)
        if (!data) {
            return res.status(403).json({
                success: false,
                message: 'Auth Token Error'
            })
        }

        // Update user with new role
        data.role = role
        const accessToken = generateAccessToken({ authId, role })
        const refreshToken = generateRefreshToken({ authId, role })
        const refreshTokenId = await updateRefreshTokenId(authId, refreshToken)
        await updateUser(authId, data)
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