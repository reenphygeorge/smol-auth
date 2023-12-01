import { NextFunction, Request, Response } from "express"
import { compare } from "bcryptjs"
import { createNewToken, getUserByEmail, updateRefreshTokenId, generateAccessToken, generateRefreshToken } from "../../smol-auth-core"
import { signUpOrSignInObject, roleObject } from "../index";


export const signin = async (req: Request, res: Response, _: NextFunction) => {
    const parsedData = signUpOrSignInObject.safeParse(req.body)

    if (!parsedData.success) {
        return res.status(403).json({
            success: false,
            message: 'Incomplete Data'
        });
    }

    const { email, password } = parsedData.data;
    // Check db for email 
    const userData = await getUserByEmail(email)
    if (userData) {
        // cross check password
        if (await compare(password, userData.password)) {
            // Get data from db
            const { role, authId } = (await getUserByEmail(email))
            const tokenData = {
                authId,
                role
            }

            // Generate new tokens with the id & role
            const accessToken = generateAccessToken(tokenData)
            const refreshToken = generateRefreshToken(tokenData)

            // Get refreshToken list from db
            let refreshTokenIdList: string[] = JSON.parse(userData.refreshTokenId)
            let refreshTokenId: string
            // Store refresh token in db
            refreshTokenId = await createNewToken(refreshToken);

            // Append new refreshtoken to list
            refreshTokenIdList.push(refreshTokenId)
            // Update user with the new refresh token
            await updateRefreshTokenId(authId, JSON.stringify(refreshTokenIdList))

            // Setup cookie with tokens
            const cookieValue = { accessToken, refreshTokenId }
            res.cookie('authData', JSON.stringify(cookieValue), {
                httpOnly: true,
                secure: true,
                expires: new Date(Date.now() + 86400000),
                path: '/',
            });
            return res.json({ success: true, message: 'Welcome Back!', authId })
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
