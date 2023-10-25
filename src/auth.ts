import { sign } from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
    })
}

const generateRefreshToken = (user) => {
    return sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: 7 * 24 * 60 * 60
    })
}

export { generateAccessToken, generateRefreshToken }