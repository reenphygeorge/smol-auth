import { sign } from 'jsonwebtoken';
import { TokenData } from '.';

const generateAccessToken = (tokenData: TokenData) => {
    try {
        return sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30m'
        })
    } catch (e) {
        console.log(e);
    }
}

const generateRefreshToken = (tokenData: TokenData) => {
    return sign(tokenData, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '3d'
    })
}

export { generateAccessToken, generateRefreshToken }