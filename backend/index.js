require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./mongoConnection');
const connection = require('./connection');
const { usermodel, walletmodel } = require('./db');
const { userRouter, walletRouter } = require('./router');
const balanceRouter = require('./balanceRouter');
const authmiddleware = require('./middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/wallets', authmiddleware, walletRouter);
app.use('/api/v1/balance', authmiddleware, balanceRouter);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate field value entered' });
    }
    
    // JWT error
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }
    
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, async () => {
    const dbConnected = await connectDB(process.env.MONGODB_URI);
    if (dbConnected) {
        console.log("Connected to MongoDB and Solana successfully");
        console.log(`Server running on http://localhost:${PORT}`);
    } else {
        console.log("Database connection failed, but server is running");
    }
});
