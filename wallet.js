const { keypair } = require("@solana/web3.js");
const cryptojs = require("crypto-js");
const connection = require('./connection');

const generatewallet = () => {
    const newkeypair =keypair.generate();
    const walletpublickey = newkeypair.publicKey.toString();
    const walletprivatekey = newkeypair.secretKey.toString();
    const secretkeyArray = Array.from(newkeypair.secretKey);
    const secretekey = JSON.stringify(secretkeyArray);
    const encryptedprivatekey = cryptojs.AES.encrypt(walletprivatekey, "secretkey").toString();

    

    return {walletpublickey, walletprivatekey, secretkeyArray, encryptedprivatekey};
}

module.exports = {generatewallet};