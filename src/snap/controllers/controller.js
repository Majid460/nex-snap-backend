// src/snap/controllers/snap.controller.js
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import SnapItem from '../../core/data/models/snapItem.js';
import bucket from '../../utils/firebase.js';
import snapQueue from '../../utils/redis.js';
import BaseResponse from '../../core/data/helper/responseWrapper.js';
import path from 'path';


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .png or .jpg images are allowed'), false);
    }
};
const upload = multer({ storage }, fileFilter);
// Upload to Firebase
const uploadToFirebase = async (buffer, originalName, mimetype) => {
    const ext = path.extname(originalName) || '.png';
    const fileName = `snaps/${Date.now()}${ext}`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
        metadata: {
            contentType: mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4()
            }
        }
    });

    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
};

const uploadSnap = [
    upload.single('image'),
    async (req, res) => {
        try {
            const existingPending = await SnapItem.findOne({
                userId: req.user.id,
                status: 'pending'
            });

            if (existingPending) {
                return res.status(429).json(new BaseResponse(
                    'Please wait — your last Snap is still processing.', null, null
                ));
            }
            const userId = req.user.id;
            const imageUrl = await uploadToFirebase(req.file.buffer, req.file.originalname, req.file.mimetype);

            const snap = await SnapItem.create({
                userId,
                imageUrl,
                status: 'pending'
            });

            await snapQueue.add('process-snap', {
                snapId: snap._id,
                imageUrl
            });

            res.status(201).json(new BaseResponse("Snap uploaded and queued for processing", null, snap));
        } catch (error) {
            console.error(error);
            res.status(500).json(new BaseResponse("Failed to upload snap", [error.message], null));
        }
    }
];

const getAllSnaps = async (req, res) => {
    try {
        const snaps = await SnapItem.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(new BaseResponse("Snaps fetched successfully", null, snaps));
    } catch (error) {
        res.status(500).json(new BaseResponse("Failed to fetch snaps", [error.message], null));
    }
};
const getProcessedSnaps = async (req, res) => {
    try {
        const snaps = await SnapItem.find({
            userId: req.user.id,
            status: 'processed'
        }).sort({ createdAt: -1 });

        res.status(200).json(new BaseResponse("Processed snaps fetched", null, snaps));
    } catch (error) {
        res.status(500).json(new BaseResponse("Failed to fetch processed snaps", [error.message], null));
    }
};
const getPendingSnaps = async (req, res) => {
    try {
        const snaps = await SnapItem.find({
            userId: req.user.id,
            status: 'pending'
        }).sort({ createdAt: -1 });

        res.status(200).json(new BaseResponse("Pending snaps fetched", null, snaps));
    } catch (error) {
        res.status(500).json(new BaseResponse("Failed to fetch pending snaps", [error.message], null));
    }
};
const getSnapById = async (req, res) => {
    try {
        const snap = await SnapItem.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!snap) return res.status(404).json(new BaseResponse("Snap not found", ["Snap ID invalid"], null));

        res.status(200).json(new BaseResponse("Snap fetched", null, snap));
    } catch (error) {
        res.status(500).json(new BaseResponse("Failed to fetch snap", [error.message], null));
    }
};


const convertToAction = async (req, res) => {
    try {
        const snap = await SnapItem.findById(req.params.id);
        if (!snap) return res.status(404).json(new BaseResponse("Snap not found", ["SnapItem with this ID doesn't exist"], null));

        const action = await Action.create({
            userId: snap.userId,
            type: snap.detectedType,
            title: snap.extractedText?.split('\n')[0] || 'Untitled',
            details: snap.extractedText,
            createdFrom: snap._id
        });

        snap.linkedAction = action._id;
        snap.status = 'processed';
        await snap.save();

        res.status(201).json(new BaseResponse("Action created from snap", null, action));
    } catch (error) {
        res.status(500).json(new BaseResponse("Failed to convert snap to action", [error.message], null));
    }
};
export default {
    uploadSnap,
    getAllSnaps,
    convertToAction,
    getPendingSnaps,
    getProcessedSnaps,
    getSnapById
};