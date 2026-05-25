# Solson - Solana Wallet Manager

## Project Structure

```
solson/
├── backend/                 # Backend API server
│   ├── index.js            # Main server file
│   ├── connection.js       # Solana connection setup
│   ├── db.js              # MongoDB schemas
│   ├── mongoConnection.js # MongoDB connection
│   ├── middleware.js      # Authentication middleware
│   ├── router.js          # API routes
│   ├── balance.js         # Balance checking functions
│   ├── balanceRouter.js   # Balance API routes
│   ├── wallet.js          # Wallet generation
│   ├── .env               # Environment variables
│   └── .gitignore         # Git ignore rules
│
├── frontend/              # Frontend application
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styling
│   ├── script.js          # Client-side JavaScript
│   └── .gitignore         # Git ignore rules
│
├── package.json           # Project dependencies
├── .env                   # Root environment variables
└── .gitignore            # Root git ignore rules
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure `.env` file exists in the `backend/` directory with your configuration.

## Running the Application

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/wallets/createwallet` - Create a new wallet
- `GET /api/v1/balance/balance/:address` - Get SOL balance
- `GET /api/v1/balance/tokens/:address` - Get token balances

## Frontend Features

- User Registration & Login
- Solana Balance Checker
- Wallet Creation
- Token Balance Viewer

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript
- **Blockchain**: Solana Web3.js
- **Authentication**: JWT, bcryptjs
- **Database**: MongoDB
# solson
# solsonn
