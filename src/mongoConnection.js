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
        if (MONGODB_URI) {
            // Log first 50 chars to verify it's the right format
            console.log('MONGODB_URI prefix:', MONGODB_URI.substring(0, 50) + '...');
        }
        console.log('Current ready state:', mongoose.connection.readyState);
        console.log('Cached connection:', !!cachedConnection);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
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
        console.log('[INFO] Starting connection attempt at:', new Date().toISOString());
        
        const mongooseOptions = {
            serverSelectionTimeoutMS: 60000,  // Increased to 60 seconds
            socketTimeoutMS: 60000,           // Increased to 60 seconds
            maxPoolSize: 3,                   // Reduced for serverless
            minPoolSize: 0,                   // No minimum for serverless
            retryWrites: false,               // Disable for stability
        };
        
        console.log('[INFO] Connection options:', JSON.stringify(mongooseOptions));
        
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        cachedConnection = mongoose.connection;
        console.log('[SUCCESS] MongoDB connected successfully at:', new Date().toISOString());
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
        console.error('[ERROR] MongoDB connection failed at:', new Date().toISOString());
        console.error('[ERROR] Error message:', error.message);
        console.error('[ERROR] Error code:', error.code);
        console.error('[ERROR] Error name:', error.name);
        console.error('[ERROR] Full error:', error);
        if (error.message.includes('SSL') || error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT') || error.message.includes('buffering')) {
            console.error('[ERROR HINT] Connection Issue - Possible causes:');
            console.error('  1. IP whitelist: Check MongoDB Atlas IP Access List');
            console.error('  2. Vercel IP might not be whitelisted (use 0.0.0.0/0)');
            console.error('  3. Network/firewall blocking connection');
            console.error('  4. MongoDB URI malformed or invalid');
        }
        return false;
    }
};

module.exports = connectDB;
