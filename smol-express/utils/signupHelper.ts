import { Request, Response } from "express";
import { createNewToken, createUser, getUserByEmail } from "../../smol-core/db";
import { generateAccessToken, generateRefreshToken } from "../../smol-core/auth";
import { hash } from "bcryptjs";
import { createNewTokenCache } from "../../smol-core/caching";
import { createId } from "@paralleldrive/cuid2";
import { __defaultRole } from "../../smol-core/rbac";

export const signupHelper = async (req: Request, res: Response, useCache: boolean) => {
    const { email, password } = req.body;
    if (!(await getUserByEmail(email))) {
        const authId = createId()
        // Store email and password (encrypted) in db and proceed.
        const tokenData = { authId, role: __defaultRole };
        const encryptedPassword: string = await hash(password, 10);
        const accessToken = generateAccessToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);
        let refreshTokenId: string;
        if (useCache)
            // caching the refresh token in redis
            refreshTokenId = await createNewTokenCache(refreshToken);
        else
            // Store refresh token in db
            refreshTokenId = await createNewToken(refreshToken);
        createUser({ auth_id: authId, email, password: encryptedPassword, role: __defaultRole, refreshTokenId });
        return res.json({ success: true, accessToken, refreshTokenId });
    }
    return res.status(403).json({
        success: false,
        message: 'User Exists'
    });
}