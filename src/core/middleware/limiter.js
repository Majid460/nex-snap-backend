import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL);

const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
    keyGenerator: (req) => req.user?.id || req.ip,
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Only 3 Snap uploads per window
    message: 'Too many uploads. Please wait before trying again.',
});

export default limiter;
