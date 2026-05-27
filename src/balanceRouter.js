const express = require('express');
const balanceRouter = express.Router();
const { getBalance, getTokenBalances } = require('./balance');

balanceRouter.get('/balance/:address', async (req, res) => {
    const { address } = req.params;
    
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    
    try {
        console.log(`[Balance Check] Checking balance for address: ${address}`);
        const balanceData = await getBalance(address);
        console.log(`[Balance Check] Result:`, balanceData);
        res.json(balanceData);
    } catch (error) {
        console.error(`[Balance Check] Error:`, error);
        res.status(500).json({ 
            error: 'Error checking balance', 
            message: error.message,
            address: address
        });
    }
});

balanceRouter.get('/tokens/:address', async (req, res) => {
    const { address } = req.params;
    
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    
    try {
        console.log(`[Token Check] Checking tokens for address: ${address}`);
        const tokenData = await getTokenBalances(address);
        console.log(`[Token Check] Found ${tokenData.tokens ? tokenData.tokens.length : 0} tokens`);
        res.json(tokenData);
    } catch (error) {
        console.error(`[Token Check] Error:`, error);
        res.status(500).json({ 
            error: 'Error checking tokens', 
            message: error.message,
            address: address
        });
    }
});

module.exports = balanceRouter;
