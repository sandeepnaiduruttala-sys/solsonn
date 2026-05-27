const { PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { connection } = require('./connection');

const getBalance = async (publicKeyString) => {
    try {
        console.log(`[getBalance] Processing address: ${publicKeyString}`);
        
        const publicKey = new PublicKey(publicKeyString);
        console.log(`[getBalance] PublicKey created: ${publicKey.toString()}`);
        
        const lamports = await connection.getBalance(publicKey);
        const sol = lamports / LAMPORTS_PER_SOL;
        
        console.log(`[getBalance] Balance: ${sol} SOL (${lamports} lamports)`);
        
        return {
            address: publicKeyString,
            lamports: lamports,
            sol: sol,
            success: true
        };
    } catch (error) {
        console.error(`[getBalance] Error:`, error.message);
        return {
            success: false,
            error: error.message,
            address: publicKeyString
        };
    }
};

const getTokenBalances = async (publicKeyString) => {
    try {
        console.log(`[getTokenBalances] Processing address: ${publicKeyString}`);
        
        const publicKey = new PublicKey(publicKeyString);
        const accounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { programId: new PublicKey('TokenkegQfeZyiNwAJsyFbPVwwQQfKP8PwYjwNQtt91111') }
        );
        
        const tokens = accounts.value.map(account => ({
            mint: account.account.data.parsed.info.mint,
            tokenAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
            decimals: account.account.data.parsed.info.tokenAmount.decimals
        }));
        
        console.log(`[getTokenBalances] Found ${tokens.length} tokens`);
        
        return {
            address: publicKeyString,
            tokens: tokens,
            success: true
        };
    } catch (error) {
        console.error(`[getTokenBalances] Error:`, error.message);
        return {
            success: false,
            error: error.message,
            address: publicKeyString
        };
    }
};

module.exports = { getBalance, getTokenBalances };
