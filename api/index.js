require('dotenv').config();
const express = require('express');
const path = require('path');

console.log('API index.js loading...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI present:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);

let connectDB, userRouter, walletRouter, authMiddleware, balanceRouter;

try {
    connectDB = require('../src/mongoConnection');
    console.log('✓ mongoConnection loaded');
} catch (err) {
    console.error('✗ Failed to load mongoConnection:', err.message);
}

try {
    const routers = require('../src/router');
    userRouter = routers.userRouter;
    walletRouter = routers.walletRouter;
    console.log('✓ routers loaded');
} catch (err) {
    console.error('✗ Failed to load routers:', err.message);
}

try {
    authMiddleware = require('../src/middleware');
    console.log('✓ middleware loaded');
} catch (err) {
    console.error('✗ Failed to load middleware:', err.message);
}

try {
    balanceRouter = require('../src/balanceRouter');
    console.log('✓ balanceRouter loaded');
} catch (err) {
    console.error('✗ Failed to load balanceRouter:', err.message);
}

const app = express();
const publicDir = path.join(__dirname, '../public');

console.log('Creating Express app...');

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
if (userRouter) app.use('/api/v1/users', userRouter);
if (walletRouter) app.use('/api/v1/wallets', authMiddleware, walletRouter);
if (balanceRouter) app.use('/api/v1/balance', authMiddleware, balanceRouter);

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

console.log('Express app created successfully');

module.exports = app;
