import { NextFunction, Request, Response } from 'express';
import { signupHelper, signinHelper, refreshTokenHelper, signoutHelper } from '..';
import { __rbacRules } from '../../smol-core';

const signup = async (req: Request, res: Response, _: NextFunction) => {
    await signupHelper(req, res, true);
}

const signupNoCache = async (req: Request, res: Response, _: NextFunction) => {
    await signupHelper(req, res, false);
}

const signin = async (req: Request, res: Response, _: NextFunction) => {
    await signinHelper(req, res, true);
}

const signinNoCache = async (req: Request, res: Response, _: NextFunction) => {
    await signinHelper(req, res, false);
}

const refreshToken = async (req: Request, res: Response, _: NextFunction) => {
    await refreshTokenHelper(req, res, true)
}

const refreshTokenNoCache = async (req: Request, res: Response, _: NextFunction) => {
    await refreshTokenHelper(req, res, false)
}

const signout = async (req: Request, res: Response, _: NextFunction) => {
    await signoutHelper(req, res, true)
}

const signoutNoCache = async (req: Request, res: Response, _: NextFunction) => {
    await signoutHelper(req, res, false)
}

export { signup, signupNoCache, signin, signinNoCache, refreshToken, refreshTokenNoCache, signout, signoutNoCache }