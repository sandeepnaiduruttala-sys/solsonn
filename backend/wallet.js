const { keypair } = require("@solana/web3.js");
const cryptojs = require("crypto-js");
const connection = require('./connection');

const generatewallet = () => {
    const bip39 = require('bip39');
    const newkeypair = keypair.generate();
    const walletpublickey = newkeypair.publicKey.toString();
    const walletprivatekey = newkeypair.secretKey.toString();
    const secretkeyArray = Array.from(newkeypair.secretKey);
    const secretekey = JSON.stringify(secretkeyArray);
    const encryptedprivatekey = cryptojs.AES.encrypt(walletprivatekey, "secretkey").toString();
    const seedPhrase = bip39.generateMnemonic();
    const encryptedSeedPhrase = cryptojs.AES.encrypt(seedPhrase, "secretkey").toString();

    return {walletpublickey, walletprivatekey, secretkeyArray, encryptedprivatekey, seedPhrase, encryptedSeedPhrase};
}

module.exports = {generatewallet};
