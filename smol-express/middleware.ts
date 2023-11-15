import { JwtPayload, TokenExpiredError, verify } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { signupHelper } from './utils/signupHelper';
import { signinHelper } from './utils/signinHelper';
import { refreshTokenHelper } from './utils/refreshTokenHelper';
import { signoutHelper } from './utils/signoutHelper';
import { roleUpdateHelper } from './utils/roleUpdateHelper';
import { __rbacRules } from '../smol-core/rbac';
import { getUser } from '../smol-core/db';

// function validateUser(req: Request, res: Response, next: NextFunction) {
// const authHeader = req.headers['authorization']
// const token = authHeader && authHeader.split(' ')[1]
// if (token === null) return res.status(403).json({
//     success: false,
//     message: 'Token Missing'
// })
// verify(token, process.env.ACCESS_TOKEN_SECRET, (err, parsedData: JwtPayload) => {
//     if (err) {
//         if (err instanceof TokenExpiredError)
//             return res.status(403).json({ success: false, message: 'Token Expired' })
//         else
//             return res.status(403).json({ success: false, message: 'Validation Error' })
//     }
//     req.body.email = parsedData.email;
//     next()
// })
// }

type Methods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

async function validateUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
        return res.status(403).json({
            success: false,
            message: 'Token Missing'
        });
    }

    verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, parsedData: JwtPayload) => {
        if (err) {
            if (err instanceof TokenExpiredError) {
                return res.status(403).json({ success: false, message: 'Token Expired' });
            } else {
                return res.status(403).json({ success: false, message: 'Validation Error' });
            } //somewhaere here
        }
        const { authId, role } = parsedData
        const { email } = (await getUser(authId))
        const route = req.path;
        const method = req.method as Methods;

        console.log(role);
        if (__rbacRules.hasOwnProperty(role)) {
            const roleRules = __rbacRules[role];


            if (roleRules === '*') {
                req.body.email = email;
                next();
            } else {
                const routeRule = roleRules.find(rule => rule.route === route);

                if (routeRule && (routeRule.method === '*' || routeRule.method.includes(method))) {
                    req.body.email = email;
                    next();
                } else {
                    return res.status(403).json({ success: false, message: 'Validation Error' });
                }
            }
        } else {
            return res.status(403).json({ success: false, message: 'Validation Error' });
        }
    });
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

function roleUpdater(req: Request, res: Response, _: NextFunction) {
    roleUpdateHelper(req, res)
}

export { validateUser, signup, signupNoCache, signin, signinNoCache, refreshToken, refreshTokenNoCache, signout, signoutNoCache, roleUpdater }