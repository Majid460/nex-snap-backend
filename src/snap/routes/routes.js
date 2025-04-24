// src/snap/routes/snap.routes.js
import express from 'express';
import snapController from '../controllers/controller.js';
import verifyToken from '../../core/middleware/middleware.js';
import limiter from '../../core/middleware/limiter.js';

const router = express.Router();

router.post('/upload', verifyToken, limiter, snapController.uploadSnap); // handles image upload + OCR
router.get('/all', verifyToken, snapController.getAllSnaps);    // returns user's snapped items
router.post('/:id/action', snapController.convertToAction); // converts to action
router.get('/processed', verifyToken, snapController.getProcessedSnaps);
router.get('/pending', verifyToken, snapController.getPendingSnaps);
router.get('/:id', verifyToken, snapController.getSnapById);

export default router;
