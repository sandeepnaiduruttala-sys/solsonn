const { Connection, clusterApiUrl } = require('@solana/web3.js');

const getConnection = (network = 'mainnet-beta') => {
    try {
        const cluster = network === 'devnet' ? 'devnet' : 'mainnet-beta';
        return new Connection(clusterApiUrl(cluster), 'confirmed');
    } catch (error) {
        console.error('Error creating connection:', error);
        throw error;
    }
};

const connection = getConnection('mainnet-beta');

module.exports = { connection, getConnection };
