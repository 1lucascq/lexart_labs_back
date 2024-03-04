const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

function authenticateUser(req, res, next) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(authToken, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decodedToken;
        next();
    });
}

module.exports = { authenticateUser }
