import mongoose from "mongoose";

const startServer = async (app) => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT_URI);
        console.log('✅ MongoDB connected');

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

export default startServer;
