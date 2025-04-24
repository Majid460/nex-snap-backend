// src/utils/redis.js
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});


const snapQueue = new Queue('snap-processing', {
    connection
});

export default snapQueue;
