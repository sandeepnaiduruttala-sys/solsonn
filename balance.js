const { PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { connection } = require('./connection');

const getBalance = async (publicKeyString) => {
    try {
        const publicKey = new PublicKey(publicKeyString);
        const lamports = await connection.getBalance(publicKey);
        const sol = lamports / LAMPORTS_PER_SOL;
        return {
            address: publicKeyString,
            lamports: lamports,
            sol: sol,
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

const getTokenBalances = async (publicKeyString) => {
    try {
        const publicKey = new PublicKey(publicKeyString);
        const accounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { programId: new PublicKey('TokenkegQfeZyiNwAJsyFbPVwwQQfKP8PwYjwNQtt91111') }
        );
        return {
            address: publicKeyString,
            tokens: accounts.value.map(account => ({
                mint: account.account.data.parsed.info.mint,
                tokenAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
                decimals: account.account.data.parsed.info.tokenAmount.decimals
            })),
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { getBalance, getTokenBalances };
