import { createId } from "@paralleldrive/cuid2";
import { createClient } from "redis"

let redisClient: any

const createNewTokenCache = async (token: string): Promise<string> => {
    // Generate a key in redis
    const tokenId = createId();
    // Add the values to redis and return tokenId
    await redisClient.set(tokenId, token);
    return tokenId;
}

const removeTokenCache = async (tokenId: string) => {
    await redisClient.del(tokenId);
}

const cacheInit = async (redisUrl: string) => {
    redisClient = await createClient({
        url: redisUrl
    })
        .on('error', err => console.log('Redis Client Error', err))
        .connect()
    // await redisClient.disconnect();
}

const getTokenByIdCache = async (tokenId: string): Promise<string> => {
    return await redisClient.get(tokenId);
}

export { createNewTokenCache, removeTokenCache, cacheInit, getTokenByIdCache };