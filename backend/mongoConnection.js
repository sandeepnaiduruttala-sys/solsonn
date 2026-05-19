require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
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
        return false;
    }
};

module.exports = connectDB;
