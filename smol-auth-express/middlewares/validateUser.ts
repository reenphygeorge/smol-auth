import { NextFunction, Request, Response } from "express";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { Methods, getUser, __rbacRules } from "smol-auth-core";
import { refreshTokenHelper, globalConfig } from "../index";

// Middleware to validate users (protected user)
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieving auth headers and separate id from it.
        const authCookie = JSON.parse(req.cookies.authData);
        const accessToken = authCookie && authCookie.accessToken
        const refreshTokenId = authCookie && authCookie.refreshTokenId

        // Throw if tokens are missing
        if (!accessToken || !refreshTokenId) {
            return res.status(403).json({
                success: false,
                message: 'Token Missing'
            });
        }

        // Verify the access token
        verify(accessToken, globalConfig.accessTokenSecret, async (err, parsedData: JwtPayload) => {

            // Global token datas
            let __authId: string
            let __role: string

            if (err) {
                // Access token expired -> Generate new token with the provided refresh token and pass it via cookie
                if (err instanceof TokenExpiredError) {
                    // get updated cookie with new access token after verification 
                    const { success, cookieValue, authId, role } = await refreshTokenHelper(refreshTokenId)
                    // error with refresh token -> clear cookie and will signout user
                    if (!success) {
                        res.clearCookie('authData')
                        return res.status(403).json({ success: false, message: 'Token Error' });
                    }

                    __authId = authId
                    __role = role

                    // generate cookie with the provided data
                    res.cookie('authData', JSON.stringify(cookieValue), {
                        httpOnly: true,
                        secure: true,
                        expires: new Date(Date.now() + 86400000),
                        path: '/',
                    });

                } else {
                    // Some other error with token -> signout user
                    res.clearCookie('authData')
                    return res.status(403).json({ success: false, message: 'Token Error' });
                }
            }
            else {
                // Update with values parsed from access token
                __authId = parsedData.authId
                __role = parsedData.role
            }

            // Permission checking
            const data = await getUser(__authId)
            if (!data) {
                // user data not found -> Signouts user
                res.clearCookie('authData')
                return res.status(403).json({
                    success: false,
                    message: 'Auth Token Error'
                })
            }

            const { email } = data
            const route = req.path;
            const method = req.method as Methods;

            // For RBAC Projects
            if (__rbacRules) {
                // Checks for rules and adds the current user's email to body for query purposes
                if (__rbacRules.hasOwnProperty(__role)) {
                    const roleRules = __rbacRules[__role];
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
            }

            // For Non RBAC Projects
            else {
                req.body.email = email;
                next();
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Validation unsuccessful!'
        })
    }
}