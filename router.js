const express = require('express');
const userRouter = express.Router();
const {usermodel} = require('./db');
const authmiddleware = require('./middleware');

userRouter.post('/register', async (req, res) => {
    const {username, password , email} = req.body;
    const userexists = await usermodel.findOne({username: username});
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    if(userexists){
        return res.status(400).json({message: "Username already exists"});
    }
    else{
        const newuser = await usermodel.create({
            username: username,
            password: password,
            email: email,
        });
        return res.status(201).json({message: "User registered successfully"});
    }
});

userRouter.post('/login', authmiddleware, async (req, res) => {
    const {username, password} = req.body;
    const userexists = await usermodel.findOne({username: username});
    const salt = await bcrypt.genSalt(10);  
    const hashpassword = await bcrypt.hash(password, salt);
    if(!userexists){
        return res.status(400).json({message: "Username does not exist you should register first"}); 
    }

        if(userexists.password !== password){
            return res.status(400).json({message: "Incorrect password"});
        }  
        if(userexists.password === password){
            return res.status(200).json({message: "User logged in successfully"});
        }
});
    walletRouter.post('/createwallet',async (req, res) => {
        const {walletname,password} = req.body;
        const walletexists = await walletmodel.findOne({userId: walletname.userId});
        if(walletexists){
            res.json({message: 'wallet opend successfully'});
        }
        else{
            const newwallet = await walletmodel.keypair.generate();
            walletpublickey = newwallet.publicKey.toString();
            walletprivatekey = newwallet.secretKey.toString();
            secretkeyArray = Array.from(newwallet.secretKey);
            secretekey = JSON.stringify(secretkeyArray);
            encryptedprivatekey = cryptojs.AES.encrypt(walletprivatekey, "secretkey").toString();
            const createdwallet = await walletmodel.create({
                walletname: walletname,
                password: password,
                userId: req.user._id,
                walletpublickey: walletpublickey,
                encryptedprivatekey: encryptedprivatekey,
            });
            res.json({message: 'wallet created successfully', wallet: newwallet});
        }
    });

module.exports = {userRouter, walletRouter};
        
        