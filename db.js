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
        minlength: 5,
        maxlength: 50
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
    }

});

connectdb =async () => {
    try{
        await mongoose.connect()
    }
    catch(err){
        console.log(err);
    }
}

const usermodel = mongoose.model("users", userschema);

module.exports = {usermodel, connectdb};