require('dotenv').config();
const express = require('express');
const connectDB = require('./mongoConnection');
const connection = require('./connection');
const { usermodel, walletmodel } = require('./db');
const authMiddleware = require('./middleware');
const userRouter = require('./router');
const walletRouter = require('./router');
const balanceRouter = require('./balanceRouter');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/wallets', authMiddleware, walletRouter);
app.use('/api/v1/balance', authMiddleware, balanceRouter);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
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