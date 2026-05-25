require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./mongoConnection');
const connection = require('./connection');
const { usermodel, walletmodel } = require('./db');
const authMiddleware = require('./middleware');
const { userRouter, walletRouter } = require('./router');
const balanceRouter = require('./balanceRouter');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '../public');

// Middleware
app.use(express.json());
app.use(express.static(publicDir));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/wallets', authMiddleware, walletRouter);
app.use('/api/v1/balance', authMiddleware, balanceRouter);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
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