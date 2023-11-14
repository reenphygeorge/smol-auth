import { sign } from 'jsonwebtoken';

type TokenData = {
    authId: string;
    role: string;
}

const generateAccessToken = (tokenData: TokenData) => {
    try {
        return sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30s'
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