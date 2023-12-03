import { NextFunction, Request, Response } from "express";
import { hash } from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";
import { createNewToken, createUser, getUserByEmail, generateAccessToken, generateRefreshToken, __defaultRole } from "smol-auth-core";
import { signUpOrSignInObject } from "../index";

export const signup = async (req: Request, res: Response, _: NextFunction) => {
    const parsedData = signUpOrSignInObject.safeParse(req.body)

    if (!parsedData.success) {
        return res.status(403).json({
            success: false,
            message: 'Incomplete Data'
        });
    }

    const { email, password } = parsedData.data;
    if (!(await getUserByEmail(email))) {
        const authId = createId()
        // Store email and password (encrypted) in db and proceed.
        const tokenData = { authId, role: __defaultRole };
        const encryptedPassword: string = await hash(password, 10);
        const accessToken = generateAccessToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);

        let refreshTokenIdList: string[] = []
        let refreshTokenId: string;
        // Store refresh token in db
        refreshTokenId = await createNewToken(refreshToken);
        refreshTokenIdList.push(refreshTokenId)
        createUser({ authId, email, password: encryptedPassword, role: __defaultRole, refreshTokenId: JSON.stringify(refreshTokenIdList) });

        // Setup cookie with tokens
        const cookieValue = { accessToken, refreshTokenId }
        res.cookie('authData', JSON.stringify(cookieValue), {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 86400000),
            path: '/',
        });
        return res.json({ success: true, message: 'Welcome!', authId });
    }
    return res.status(403).json({
        success: false,
        message: 'User Exists'
    });
}