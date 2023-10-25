import { verify } from 'jsonwebtoken';
import { getRefreshTokens } from '../redis';
import { NextFunction, Request, Response } from 'express';

function validateUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token === null) return res.sendStatus(401)
    verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        if (err) return res.sendStatus(403)
        req.body.user = data
        next()
    })
}

function validateRefreshToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const refreshToken = authHeader && authHeader.split(' ')[1]
    if (!refreshToken) return res.sendStatus(401)
    verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) return res.sendStatus(403)
        req.body.user = data
        next()
    })
}

function validateLogoutToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)
    getRefreshTokens().then((refreshToken) => {
        if (!refreshToken.includes(token)) return res.sendStatus(403)
        req.body.token = token
        next()
    })
}

export { validateUser, validateRefreshToken, validateLogoutToken }