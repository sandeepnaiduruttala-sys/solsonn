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
        
        const token = jwt.sign({_id: newuser._id, username: newuser.username}, process.env.JWT_SECRET);
        
        return res.status(201).json({message: "User registered successfully", token: token});
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
    const {walletname, password} = req.body;
    const walletexists = await walletmodel.findOne({userId: req.user._id});
    if(walletexists){
        return res.json({message: 'wallet opened successfully'});
    }
    else{
        try {
            const { Keypair } = require('@solana/web3.js');
            const newwallet = Keypair.generate();
            const walletpublickey = newwallet.publicKey.toString();
            const walletprivatekey = newwallet.secretKey.toString();
            const secretkeyArray = Array.from(newwallet.secretKey);
            const secretekey = JSON.stringify(secretkeyArray);
            const encryptedprivatekey = cryptojs.AES.encrypt(walletprivatekey, password).toString();
            
            const createdwallet = await walletmodel.create({
                walletname: walletname,
                password: password,
                userId: req.user._id,
                walletpublickey: walletpublickey,
                encryptedprivatekey: encryptedprivatekey,
            });
            res.json({message: 'wallet created successfully', wallet: {publicKey: walletpublickey}});
        } catch (error) {
            res.status(500).json({message: 'Error creating wallet', error: error.message});
        }
    }
});

module.exports = {userRouter, walletRouter};
