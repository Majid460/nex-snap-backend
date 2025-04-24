// models/Action.js
import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['task', 'event', 'expense', 'note'], required: true },
    title: { type: String, required: true },
    details: String,
    amount: Number,       // For expenses
    dueDate: Date,        // For tasks/events
    tags: [String],
    completed: { type: Boolean, default: false },
    createdFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'SnapItem' },
    createdAt: { type: Date, default: Date.now }
});

const Action = mongoose.model('Action', actionSchema);
export default Action;
