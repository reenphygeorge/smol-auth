import { createClient } from "redis"

let redisClient

const addNewToken = async (token: string) => {
    const data = await redisClient.get('refreshTokens');
    const refreshTokens = JSON.parse(data);
    refreshTokens.push(token)
    await redisClient.set('refreshTokens', JSON.stringify(refreshTokens));
}

const removeToken = async (token: string) => {
    const data = await redisClient.get('refreshTokens');
    const refreshTokens = JSON.parse(data);
    const newRefreshTokens = refreshTokens.filter(currentToken => currentToken !== token);
    await redisClient.set('refreshTokens', JSON.stringify(newRefreshTokens));
}

const redisInit = async () => {
    redisClient = await createClient({
        url:'redis://:@redis:6379'
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect()
    await redisClient.set('refreshTokens', JSON.stringify([]));
    // await redisClient.disconnect();
}

const getRefreshTokens = async (): Promise<string[]> => {
    return await redisClient.get('refreshTokens');
}
export { addNewToken, removeToken, redisInit, getRefreshTokens };