import { NextFunction, Request, Response } from "express";
import { JwtPayload, TokenExpiredError, verify } from "jsonwebtoken";
import { Methods, getUser, __rbacRules } from "../../smol-core";

// Middleware to validate users (protected user)
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
        return res.status(403).json({
            success: false,
            message: 'Token Missing'
        });
    }

    // Verify the access token
    verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, parsedData: JwtPayload) => {
        if (err) {
            if (err instanceof TokenExpiredError) {
                return res.status(403).json({ success: false, message: 'Token Expired' });
            } else {
                return res.status(403).json({ success: false, message: 'Validation Error' });
            }
        }
        const { authId, role } = parsedData
        const { email } = (await getUser(authId))
        const route = req.path;
        const method = req.method as Methods;

        // For RBAC Projects
        if (__rbacRules) {
            // Checks for rules and adds the current user's email to body for query purposes
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
        }

        // For Non RBAC Projects
        else {
            req.body.email = email;
            next();
        }
    });
}