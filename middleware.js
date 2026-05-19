const jwt = require('jsonwebtoken');

function authmiddleware(req, res, next) {

    const token = req.header('Token');

    if (!token) {
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

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = authmiddleware;