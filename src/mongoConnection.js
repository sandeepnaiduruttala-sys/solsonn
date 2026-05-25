require('dotenv').config();
const mongoose = require('mongoose');

// Cache connection for serverless environments
let cachedConnection = null;

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        
        if (!MONGODB_URI) {
            console.error('MongoDB URI not found in environment variables');
            return false;
        }
        
        // Return cached connection if already connected
        if (cachedConnection && mongoose.connection.readyState === 1) {
            console.log('Using cached MongoDB connection');
            return true;
        }

        const mongooseOptions = {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
            maxPoolSize: 5,
            minPoolSize: 1,
        };
        
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        cachedConnection = mongoose.connection;
        console.log('MongoDB connected successfully');
        
        // Drop old collections to clear validators (only on first connection)
        try {
            if (!cachedConnection.collectionDropped) {
                await mongoose.connection.dropCollection("users");
                await mongoose.connection.dropCollection("wallets");
                cachedConnection.collectionDropped = true;
                console.log("Old collections dropped to reset schema");
            }
        } catch (err) {
            console.log("Collections already dropped or don't exist");
        }
        
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        if (error.message.includes('SSL')) {
            console.log('SSL/TLS Error - Check MongoDB Atlas IP whitelist');
            console.log('Make sure your IP address is whitelisted in MongoDB Atlas');
        }
        return false;
    }
};

module.exports = connectDB;
