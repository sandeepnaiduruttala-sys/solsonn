const jwt = require('jsonwebtoken');

function authmiddleware(req, res, next) {
    // Try to get token from Authorization header (Bearer token) or Token header
    let token = req.header('Authorization');
    
    // Remove 'Bearer ' prefix if present
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    
    // Fallback to 'Token' header for backward compatibility
    if (!token) {
        token = req.header('Token');
    }

    if (!token) {
        console.warn('Auth: No token provided');
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try {
        const verification = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verification;
        console.log('Auth: Token verified for user:', verification.username);

        next();

    } catch (error) {
        console.error('Auth: Token verification error:', error.message);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = authmiddleware;