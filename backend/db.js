const mongoose = require("mongoose");

// Drop existing collections to clear any old validators
async function dropCollections() {
    try {
        await mongoose.connection.dropCollection("users");
        await mongoose.connection.dropCollection("wallets");
        console.log("Collections dropped successfully");
    } catch (err) {
        console.log("No collections to drop or error dropping:", err.message);
    }
}

const userschema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        // Don't validate length - bcrypt hashes are 60 chars which exceeds any reasonable limit
        // Validation is handled in the router
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
        // Don't validate length for wallet password either
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

connectdb =async () => {
    try{
        await mongoose.connect()
    }
    catch(err){
        console.log(err);
    }
}

const usermodel = (() => {
    // Delete existing model if it exists (to clear schema cache)
    if (mongoose.models.users) {
        delete mongoose.models.users;
    }
    return mongoose.model("users", userschema);
})();

const walletmodel = (() => {
    // Delete existing model if it exists
    if (mongoose.models.wallets) {
        delete mongoose.models.wallets;
    }
    return mongoose.model("wallets", walletschema);
})();

module.exports = {usermodel, walletmodel, connectdb};
