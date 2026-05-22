require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:[^@]*@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
})
.then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
})
.catch((error) => {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('authentication failed')) {
        console.log('\n⚠️  Authentication failed! Please:');
        console.log('1. Go to https://cloud.mongodb.com');
        console.log('2. Go to Security → Database Access');
        console.log('3. Edit user "sandeepnaiduruttala_db_user"');
        console.log('4. Set password to: sandeep12345');
        console.log('5. Save and try again');
    }
    process.exit(1);
});
