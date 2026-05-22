require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        // Disable SSL certificate validation temporarily for debugging (NOT for production)
        const mongooseOptions = {
            serverSelectionTimeoutMS: 20000,
            socketTimeoutMS: 45000,
        };
        
        await mongoose.connect(MONGODB_URI, mongooseOptions);
        console.log('MongoDB connected successfully');
        
        // Drop old collections to clear validators
        try {
            await mongoose.connection.dropCollection("users");
            await mongoose.connection.dropCollection("wallets");
            console.log("Old collections dropped to reset schema");
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

module.exports = connectDB;
