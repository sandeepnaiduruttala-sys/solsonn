require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('../src/mongoConnection');
const { userRouter, walletRouter } = require('../src/router');
const authMiddleware = require('../src/middleware');
const balanceRouter = require('../src/balanceRouter');

const app = express();
const publicDir = path.join(__dirname, '../public');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Set JSON response header for API routes only
app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use(express.static(publicDir));

// Database connection middleware (runs once per serverless container)
let dbInitialized = false;
let dbError = null;

app.use(async (req, res, next) => {
    if (!dbInitialized) {
        try {
            const connected = await connectDB();
            dbInitialized = true;
            if (!connected) {
                dbError = 'MongoDB connection failed';
                console.warn('Warning: Database connection failed, continuing anyway');
            }
        } catch (err) {
            dbError = err.message;
            console.error('DB initialization error:', err);
            // Don't block requests, just warn
        }
    }
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        dbConnected: !dbError,
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/wallets', authMiddleware, walletRouter);
app.use('/api/v1/balance', authMiddleware, balanceRouter);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.setHeader('Content-Type', 'application/json');
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

module.exports = app;
