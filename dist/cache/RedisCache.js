"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = exports.getCache = exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
exports.redisClient = (0, redis_1.createClient)({
    url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`
});
exports.redisClient.on('error', (err) => logger_1.logger.error('Redis Client Error', err));
let isConnected = false;
const connectRedis = async () => {
    if (!isConnected) {
        await exports.redisClient.connect();
        isConnected = true;
        logger_1.logger.info('Connected to Redis');
    }
};
exports.connectRedis = connectRedis;
const getCache = async (key) => {
    try {
        const data = await exports.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }
    catch (error) {
        logger_1.logger.error('Redis GET Error', error);
        return null; // Fallback to non-cached on error
    }
};
exports.getCache = getCache;
const setCache = async (key, data, ttlDays = 7) => {
    try {
        const ttlSeconds = ttlDays * 24 * 60 * 60;
        await exports.redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    }
    catch (error) {
        logger_1.logger.error('Redis SET Error', error);
    }
};
exports.setCache = setCache;
