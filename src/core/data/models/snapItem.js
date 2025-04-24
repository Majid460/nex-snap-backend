// models/SnapItem.js
import mongoose from 'mongoose';

const snapItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String, required: true },
    extractedText: String,
    detectedType: {
        type: String, enum: ['task', 'event', 'expense', 'note'], required: false,
        default: null
    },
    status: { type: String, enum: ['pending', 'processed'], default: 'pending' },
    linkedAction: { type: mongoose.Schema.Types.ObjectId, ref: 'Action' },
    createdAt: { type: Date, default: Date.now },
    aiSummary: {
        type: String
    },
    rawText: {
        type: String
    }
});

const SnapItem = mongoose.model('SnapItem', snapItemSchema);
export default SnapItem;
