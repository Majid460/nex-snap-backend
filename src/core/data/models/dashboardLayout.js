// models/DashboardLayout.js
import mongoose from 'mongoose';

const dashboardLayoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    widgets: [
        {
            name: { type: String }, // 'calendar', 'todo', etc.
            position: { type: Object }, // {x, y, width, height}
            isVisible: { type: Boolean, default: true }
        }
    ],
    lastUpdated: { type: Date, default: Date.now }
});

const DashboardLayout = mongoose.model('DashboardLayout', dashboardLayoutSchema);
export default DashboardLayout;
