import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: String,
    password: { type: String, required: true }, // Store hashed password
    profileImageUrl: String,
    role: { type: String, default: 'user' },
    preferredTheme: { type: String, default: 'light' },
    layoutConfig: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DashboardLayout'
    },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
