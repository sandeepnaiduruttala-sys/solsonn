const express = require('express');
const balanceRouter = express.Router();
const { getBalance, getTokenBalances } = require('./balance');

balanceRouter.get('/balance/:address', async (req, res) => {
    const { address } = req.params;
    
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    
    const balanceData = await getBalance(address);
    res.json(balanceData);
});

balanceRouter.get('/tokens/:address', async (req, res) => {
    const { address } = req.params;
    
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }
    
    const tokenData = await getTokenBalances(address);
    res.json(tokenData);
});

module.exports = balanceRouter;
