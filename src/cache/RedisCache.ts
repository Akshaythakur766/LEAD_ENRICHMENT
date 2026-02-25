import { createClient } from 'redis';
import { logger } from '../utils/logger';

export const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`
});

let isConnected = false;

redisClient.on('error', (err) => {
    logger.warn('Redis Client Error (will fallback to no-cache)', err.message);
    isConnected = false;
});

export const connectRedis = async () => {
    if (!isConnected) {
        await redisClient.connect();
        isConnected = true;
        logger.info('Connected to Redis');
    }
};

export const getCache = async (key: string): Promise<any | null> => {
    if (!isConnected) return null;
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        logger.error('Redis GET Error', error);
        return null; // Fallback to non-cached on error
    }
};

export const setCache = async (key: string, data: any, ttlDays: number = 7): Promise<void> => {
    if (!isConnected) return;
    try {
        const ttlSeconds = ttlDays * 24 * 60 * 60;
        await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    } catch (error) {
        logger.error('Redis SET Error', error);
    }
};
