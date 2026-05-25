require('dotenv').config();
const mongoose = require('mongoose');

// Cache connection for serverless environments
let cachedConnection = null;
let connectionAttempts = 0;

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        
        console.log(`[MongoDB Connection Attempt #${++connectionAttempts}]`);
        console.log('MONGODB_URI present:', !!MONGODB_URI);
        console.log('MONGODB_URI length:', MONGODB_URI ? MONGODB_URI.length : 0);
        console.log('Current ready state:', mongoose.connection.readyState);
        console.log('Cached connection:', !!cachedConnection);
        
        if (!MONGODB_URI) {
            console.error('[ERROR] MongoDB URI not found in environment variables');
            return false;
        }
        
        // Return cached connection if already connected
        if (cachedConnection && mongoose.connection.readyState === 1) {
            console.log('[SUCCESS] Using cached MongoDB connection');
            return true;
        }

        console.log('[INFO] Establishing new MongoDB connection...');
        
        const mongooseOptions = {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 5,
            minPoolSize: 1,
        };
        
        console.log('[INFO] Connection options:', JSON.stringify(mongooseOptions));
        
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        cachedConnection = mongoose.connection;
        console.log('[SUCCESS] MongoDB connected successfully');
        console.log('[INFO] Ready state:', mongoose.connection.readyState);
        
        // Drop old collections to clear validators (only on first connection in development)
        // Skip in production to avoid data loss
        if (process.env.NODE_ENV !== 'production') {
            try {
                if (!cachedConnection.collectionDropped) {
                    await mongoose.connection.dropCollection("users");
                    await mongoose.connection.dropCollection("wallets");
                    cachedConnection.collectionDropped = true;
                    console.log("[INFO] Old collections dropped to reset schema");
                }
            } catch (err) {
                console.log("[INFO] Collections already dropped or don't exist:", err.message);
            }
        }
        
        return true;
    } catch (error) {
        console.error('[ERROR] MongoDB connection error:', error.message);
        console.error('[ERROR] Error code:', error.code);
        console.error('[ERROR] Error name:', error.name);
        if (error.message.includes('SSL') || error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
            console.error('[ERROR HINT] Connection/SSL Issue - Check MongoDB Atlas:');
            console.error('  - IP whitelist: https://cloud.mongodb.com/v2/...');
            console.error('  - Current IP might not be whitelisted');
            console.error('  - Try adding 0.0.0.0/0 for development');
        }
        return false;
    }
};

module.exports = connectDB;
