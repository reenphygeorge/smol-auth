import { NextFunction, Request, Response } from 'express';
import { signupHelper, roleUpdateHelper, signinHelper, refreshTokenHelper, signoutHelper } from '.';
import { __rbacRules } from '../smol-core';

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

function roleUpdater(req: Request, res: Response, _: NextFunction) {
    roleUpdateHelper(req, res)
}

export { signup, signupNoCache, signin, signinNoCache, refreshToken, refreshTokenNoCache, signout, signoutNoCache, roleUpdater }