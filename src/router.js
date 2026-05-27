const express = require('express');
const bcrypt = require('bcryptjs');
const cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');
const userRouter = express.Router();
const walletRouter = express.Router();
const {usermodel, walletmodel} = require('./db');
const authmiddleware = require('./middleware');

userRouter.post('/register', async (req, res) => {
    try {
        const {username, password , email} = req.body;
        
        // Validate inputs
        if (!username || !password || !email) {
            return res.status(400).json({message: "Username, email, and password are required"});
        }
        
        if (password.length < 5) {
            return res.status(400).json({message: "Password must be at least 5 characters"});
        }
        
        const userexists = await usermodel.findOne({username: username});
        if(userexists){
            return res.status(400).json({message: "Username already exists"});
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        
        const newuser = await usermodel.create({
            username: username,
            password: hashpassword,
            email: email,
        });
        
        return res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        console.error('Register error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({message: "Validation error", details: error.message});
        }
        if (error.code === 11000) {
            return res.status(400).json({message: "Username or email already exists"});
        }
        return res.status(500).json({message: "Registration error", error: error.message});
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;
        const userexists = await usermodel.findOne({username: username});
        
        if(!userexists){
            return res.status(400).json({message: "Username does not exist you should register first"}); 
        }

        const isPasswordValid = await bcrypt.compare(password, userexists.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Incorrect password"});
        }  
        
        const token = jwt.sign({_id: userexists._id, username: userexists.username}, process.env.JWT_SECRET);
        return res.status(200).json({message: "User logged in successfully", userId: userexists._id, token: token});
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({message: "Login error", error: error.message});
    }
});
walletRouter.post('/createwallet', authmiddleware, async (req, res) => {
    try {
        const {walletname, password} = req.body;
        
        if (!password) {
            return res.status(400).json({message: 'Wallet password is required'});
        }
        
        const walletexists = await walletmodel.findOne({userId: req.user._id});
        if(walletexists){
            return res.json({message: 'wallet opened successfully', wallet: {publicKey: walletexists.walletpublickey}});
        }
        
        try {
            const { Keypair } = require('@solana/web3.js');
            const bip39 = require('bip39');
            
            // Generate new keypair
            const newwallet = Keypair.generate();
            const walletpublickey = newwallet.publicKey.toString();
            const walletprivatekey = newwallet.secretKey.toString();
            const secretkeyArray = Array.from(newwallet.secretKey);
            const secretekey = JSON.stringify(secretkeyArray);
            
            // Encrypt private key with wallet password
            const encryptedprivatekey = cryptojs.AES.encrypt(walletprivatekey, password).toString();
            
            // Generate and encrypt seed phrase
            const seedPhrase = bip39.generateMnemonic();
            const encryptedSeedPhrase = cryptojs.AES.encrypt(seedPhrase, password).toString();
            
            // Save wallet to database
            const createdwallet = await walletmodel.create({
                walletname: walletname || 'My Wallet',
                password: password,
                userId: req.user._id,
                walletpublickey: walletpublickey,
                encryptedprivatekey: encryptedprivatekey,
                encryptedSeedPhrase: encryptedSeedPhrase,
            });
            
            console.log('Wallet created successfully for user:', req.user.username);
            res.json({
                message: 'wallet created successfully', 
                wallet: {
                    publicKey: walletpublickey, 
                    seedPhrase: seedPhrase
                }
            });
        } catch (error) {
            console.error('Wallet creation error:', error);
            res.status(500).json({
                message: 'Error creating wallet', 
                error: error.message,
                details: error.stack
            });
        }
    } catch (error) {
        console.error('Wallet endpoint error:', error);
        res.status(500).json({
            message: 'Unexpected error',
            error: error.message
        });
    }
});

walletRouter.post('/createtoken', authmiddleware, async (req, res) => {
    try {
        const {tokenName, tokenSymbol, decimals, initialSupply} = req.body;
        
        if (!tokenName || !tokenSymbol || decimals === undefined || initialSupply === undefined) {
            return res.status(400).json({message: 'tokenName, tokenSymbol, decimals, and initialSupply are required'});
        }
        
        const wallet = await walletmodel.findOne({userId: req.user._id});
        if (!wallet) {
            return res.status(400).json({message: 'Wallet not found'});
        }
        
        // Store token information - you can extend this with actual token creation logic
        const tokenInfo = {
            tokenName,
            tokenSymbol,
            decimals,
            initialSupply,
            creatorPublicKey: wallet.walletpublickey,
            createdAt: new Date()
        };
        
        res.json({message: 'Token created successfully', token: tokenInfo});
    } catch (error) {
        res.status(500).json({message: 'Error creating token', error: error.message});
    }
});

walletRouter.get('/tokens', authmiddleware, async (req, res) => {
    try {
        const wallet = await walletmodel.findOne({userId: req.user._id});
        if (!wallet) {
            return res.status(400).json({message: 'Wallet not found'});
        }
        
        // Return token list - extend this with actual token retrieval logic
        res.json({message: 'Tokens retrieved', tokens: [], walletPublicKey: wallet.walletpublickey});
    } catch (error) {
        res.status(500).json({message: 'Error retrieving tokens', error: error.message});
    }
});

walletRouter.get('/wallet-details', authmiddleware, async (req, res) => {
    try {
        const wallet = await walletmodel.findOne({userId: req.user._id});
        if (!wallet) {
            return res.status(400).json({message: 'Wallet not found'});
        }
        
        res.json({
            message: 'Wallet details retrieved',
            wallet: {
                publicKey: wallet.walletpublickey,
                walletName: wallet.walletname,
                balance: wallet.balance || 0,
                createdAt: wallet.date
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Error retrieving wallet details', error: error.message});
    }
});

walletRouter.post('/view-privatekey', authmiddleware, async (req, res) => {
    try {
        const {password} = req.body;
        if (!password) {
            return res.status(400).json({message: 'Password is required'});
        }
        
        const wallet = await walletmodel.findOne({userId: req.user._id});
        if (!wallet) {
            return res.status(400).json({message: 'Wallet not found'});
        }
        
        // Verify password matches wallet password
        if (wallet.password !== password) {
            return res.status(400).json({message: 'Incorrect password'});
        }
        
        try {
            // Decrypt private key - properly convert from encrypted word object
            const decryptedPrivateKeyBytes = cryptojs.AES.decrypt(wallet.encryptedprivatekey, password);
            const decryptedPrivateKey = decryptedPrivateKeyBytes.toString(cryptojs.enc.Utf8);
            
            const decryptedSeedPhraseBytes = cryptojs.AES.decrypt(wallet.encryptedSeedPhrase, password);
            const decryptedSeedPhrase = decryptedSeedPhraseBytes.toString(cryptojs.enc.Utf8);
            
            if (!decryptedPrivateKey || !decryptedSeedPhrase) {
                return res.status(400).json({message: 'Failed to decrypt keys - password may be incorrect'});
            }
            
            res.json({
                message: 'Private key retrieved',
                privateKey: decryptedPrivateKey,
                seedPhrase: decryptedSeedPhrase,
                publicKey: wallet.walletpublickey
            });
        } catch (decryptError) {
            console.error('Decryption error:', decryptError);
            return res.status(400).json({message: 'Failed to decrypt keys - invalid password or corrupted data'});
        }
    } catch (error) {
        console.error('View private key error:', error);
        res.status(500).json({message: 'Error retrieving private key', error: error.message});
    }
});

walletRouter.get('/wallet-balance', authmiddleware, async (req, res) => {
    try {
        const network = req.query.network || 'mainnet-beta';
        const wallet = await walletmodel.findOne({userId: req.user._id});
        
        if (!wallet) {
            return res.status(400).json({message: 'Wallet not found'});
        }
        
        try {
            const { getConnection } = require('./connection');
            const { PublicKey } = require('@solana/web3.js');
            
            console.log(`[Wallet Balance] Fetching balance for network: ${network}`);
            
            const connection = getConnection(network);
            const publicKey = new PublicKey(wallet.walletpublickey);
            
            console.log(`[Wallet Balance] Getting balance for address: ${wallet.walletpublickey}`);
            
            const balance = await connection.getBalance(publicKey);
            const solBalance = balance / 1e9; // Convert lamports to SOL
            
            console.log(`[Wallet Balance] Balance retrieved: ${solBalance} SOL`);
            
            res.json({
                message: 'Balance retrieved',
                publicKey: wallet.walletpublickey,
                balance: solBalance,
                lamports: balance,
                walletName: wallet.walletname,
                network: network
            });
        } catch (connError) {
            console.error('[Wallet Balance] Connection error:', connError);
            res.status(500).json({
                message: 'Error connecting to blockchain network', 
                error: connError.message,
                network: network,
                details: connError.toString()
            });
        }
    } catch (error) {
        console.error('[Wallet Balance] Error:', error);
        res.status(500).json({
            message: 'Error retrieving balance', 
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = {userRouter, walletRouter};
        
        