const jwt = require('jsonwebtoken');

function authmiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({message: "No token provided"});
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({message: "Invalid token format"});
        }
        
        const verification = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verification;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({message: "Invalid token"});
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({message: "Token expired"});
        }
        return res.status(401).json({message: "Authentication failed"});
    }
}

module.exports = authmiddleware;
