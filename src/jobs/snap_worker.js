// src/jobs/snap.worker.js
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

import SnapItem from '../core/data/models/snapItem.js';
import runOCR from '../../src/services/ocr/service.js';
import classifySnap from '../services/ai/service.js';
import socket from '../../src/core/data/sockets/server.js';
import BaseResponse from '../core/data/helper/responseWrapper.js';

mongoose.connect(process.env.MONGODB_CONNECT_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected (worker)');
}).catch(err => {
    console.error('❌ Worker MongoDB connection error:', err.message);
    process.exit(1);
});
const connection = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
});

const worker = new Worker('snap-processing', async job => {
    const { snapId, imageUrl } = job.data;

    console.log(`🧪 Starting OCR for Snap: ${snapId}`);
    console.log(`Image URL: ${imageUrl}`);
    const extractedText = await runOCR(imageUrl); // use Firebase URL
    const { type, summary, raw } = await classifySnap(extractedText);

    const snap = await SnapItem.findById(snapId);
    if (!snap) throw new Error('SnapItem not found');

    snap.detectedType = type;
    snap.aiSummary = summary;
    snap.rawText = raw;
    snap.status = 'processed';
    socket.emitSnapDone(snap._id.toString(), new BaseResponse('Snap processed', null, snap));
    await snap.save();
}, { connection });

worker.on('completed', job => {
    console.log(`✅ Snap processed: Job ${job.id}`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Job ${job.id} failed:`, err.message);
});
