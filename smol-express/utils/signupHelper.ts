import { Request, Response } from "express";
import { createNewToken, createUser, getUserByEmail } from "../../smol-core/db";
import { generateAccessToken, generateRefreshToken } from "../../smol-core/auth";
import { hash } from "bcryptjs";
import { createNewTokenCache } from "../../smol-core/caching";
import { createId } from "@paralleldrive/cuid2";

export const signupHelper = async (req: Request, res: Response, useCache: boolean) => {
    const { email, password } = req.body;
    if (!(await getUserByEmail(email))) {
        // Store email and password (encrypted) in db and proceed.
        const tokenData = { email };
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
        createUser({ auth_id: createId(), email, password: encryptedPassword, refreshTokenId });
        return res.json({ success: true, accessToken, refreshTokenId });
    }
    return res.status(403).json({
        success: false,
        message: 'User Exists'
    });
}