// db.mjs

import mongoose from 'mongoose';

const connectDB = async () => {
    // Prefer env-based URI for flexible deployments.
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/NewsMaker360";
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Tip: ensure MongoDB is running locally, or set a valid MONGO_URI in Backend/.env');
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
