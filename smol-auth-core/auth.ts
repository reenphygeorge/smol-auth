import { sign } from 'jsonwebtoken';
import { TokenData } from '.';

const generateAccessToken = (tokenData: TokenData, accessTokenSecret: string) => {
    try {
        return sign(tokenData, accessTokenSecret, {
            expiresIn: '30m'
        })
    } catch (err) {
        console.log(err);
    }
}

const generateRefreshToken = (tokenData: TokenData, refreshTokenSecret: string) => {
    return sign(tokenData, refreshTokenSecret, {
        expiresIn: '7d'
    })
}

export { generateAccessToken, generateRefreshToken }