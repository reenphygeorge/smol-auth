import { sign } from 'jsonwebtoken';
import { TokenData } from '.';
import { globalConfig } from '../smol-auth-express';

const generateAccessToken = (tokenData: TokenData) => {
    try {
        return sign(tokenData, globalConfig.accessTokenSecret, {
            expiresIn: '30m'
        })
    } catch (err) {
        console.log(err);
    }
}

const generateRefreshToken = (tokenData: TokenData) => {
    return sign(tokenData, globalConfig.refreshTokenSecret, {
        expiresIn: '7d'
    })
}

export { generateAccessToken, generateRefreshToken }