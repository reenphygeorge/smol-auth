import { JwtPayload, TokenExpiredError, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { signupHelper } from './utils/signupHelper';
import { signinHelper } from './utils/signinHelper';
import { refreshTokenHelper } from './utils/refreshTokenHelper';
import { signoutHelper } from './utils/signoutHelper';

function validateUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.status(403).json({
        success: false,
        message: 'Token Missing'
    })
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, parsedData: JwtPayload) => {
        if (err) {
            if (err instanceof TokenExpiredError)
                return res.status(403).json({ success: false, message: 'Token Expired' })
            else
                return res.status(403).json({ success: false, message: 'Validation Error' })
        }
        req.body.email = parsedData.email;
        next()
    })
}

async function signup(req: Request, res: Response, _: NextFunction) {
    await signupHelper(req, res, true);
}

async function signupNoCache(req: Request, res: Response, _: NextFunction) {
    await signupHelper(req, res, false);
}

async function signin(req: Request, res: Response, _: NextFunction) {
    await signinHelper(req, res, true);
}

async function signinNoCache(req: Request, res: Response, _: NextFunction) {
    await signinHelper(req, res, false);
}

async function refreshToken(req: Request, res: Response, _: NextFunction) {
    await refreshTokenHelper(req, res, true)
}

async function refreshTokenNoCache(req: Request, res: Response, _: NextFunction) {
    await refreshTokenHelper(req, res, false)
}

async function signout(req: Request, res: Response, _: NextFunction) {
    await signoutHelper(req, res, true)
}

async function signoutNoCache(req: Request, res: Response, _: NextFunction) {
    await signoutHelper(req, res, false)
}

export { validateUser, signup, signupNoCache, signin, signinNoCache, refreshToken, refreshTokenNoCache, signout, signoutNoCache }