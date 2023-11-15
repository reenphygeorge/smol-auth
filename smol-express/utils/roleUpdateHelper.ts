import { Request, Response } from "express";
import { getUser, updateRefreshTokenId, updateUser } from "../../smol-core/db";
import { __rbacRules } from "../../smol-core/rbac";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../smol-core/auth";

export const roleUpdateHelper = async (req: Request, res: Response) => {
    // Check if given role is already configured
    const { role } = req.body
    if (!__rbacRules.hasOwnProperty(role))
        return res.status(403).json({
            success: false,
            message: 'Illegal Role'
        })

    // Get authId from headers and handle errors
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, parsedData: JwtPayload) => {
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
        return res.json({ success: true, accessToken, refreshToken: refreshTokenId, message: `Role updated to ${data.role}` })
    })
}