import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";
import { createNewToken, createUser, getUserByEmail, generateAccessToken, generateRefreshToken, createNewTokenCache, __defaultRole } from "../../smol-core";

export const signupHelper = async (req: Request, res: Response, useCache: boolean) => {
    const { email, password } = req.body;
    if (!(await getUserByEmail(email))) {
        const authId = createId()
        // Store email and password (encrypted) in db and proceed.
        const tokenData = { authId, role: __defaultRole };
        const encryptedPassword: string = await hash(password, 10);
        const accessToken = generateAccessToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);

        let refreshTokenIdList: string[] = []
        let refreshTokenId: string;
        if (useCache)
            // caching the refresh token in redis
            refreshTokenId = await createNewTokenCache(refreshToken);
        else
            // Store refresh token in db
            refreshTokenId = await createNewToken(refreshToken);
        refreshTokenIdList.push(refreshTokenId)
        createUser({ auth_id: authId, email, password: encryptedPassword, role: __defaultRole, refreshTokenId: JSON.stringify(refreshTokenIdList) });

        // Setup cookie with tokens
        const cookieValue = { accessToken, refreshTokenId }
        res.cookie('authData', JSON.stringify(cookieValue), {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 86400000),
            path: '/',
        });
        return res.json({ success: true, message: 'Welcome!' });
    }
    return res.status(403).json({
        success: false,
        message: 'User Exists'
    });
}