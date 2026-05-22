const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        // Don't validate length - bcrypt hashes are 60 chars
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const walletschema = new mongoose.Schema({
    walletname:{
        type: String
    },
    password: {
        type: String,
        required: true,
        // Don't validate length for wallet password
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    walletpublickey: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    encryptedprivatekey: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    encryptedSeedPhrase: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
    });

connectdb =async (MONGODB_URI) => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    }
    catch(err){
        console.log(err);
    }
}

const usermodel = mongoose.model("users", userschema);
const walletmodel = mongoose.model("wallets", walletschema);
module.exports = {usermodel, walletmodel, connectdb};