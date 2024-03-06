const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret";

function authenticateUser(req, res, next) {
	try {
		const { token } = req.headers;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
			if (err) {
				return res.status(401).json({ message: "Unauthorized" });
			}
			req.user = decodedToken;
            next();
		});
	} catch (error) {
        console.error(`error in authenticateUser: ${error}`);
        res.status(500).json({ message: 'Internal Server Error'})
    }

}

module.exports = { authenticateUser };
