const db = require("../models");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

exports.register = async (req, res) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ where: { username } });

		if (existingUser) {
			return res.status(400).json({
				message: `The user '${username}' already exists.`,
			});
		}

		const newUser = await User.create({ username, password });
		const userId = newUser.dataValues.id;
		const token = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
			expiresIn: "3h",
		});

		res.status(201).json({
			user: { userId, username, password },
			token,
			message: "User registered successfully.",
		});
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

exports.login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const userData = await User.findOne({ where: { username } });

		if (!userData.dataValues) {
			res.status(401).json({ message: "Invalid username" });
		}

		const user = {
			id: userData.dataValues.id,
			username: userData.dataValues.username,
			password: userData.dataValues.password,
		};

		if (user.password !== password) res.status(401).json({ message: "Invalid password" });

		const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
			expiresIn: "3h",
		});

		res.status(200).json({ username, token });
	} catch (error) {
		console.error(`Error in /api/login: ${error}`);
		res.status(500).send({ message: "Internal Server Error" });
	}
};
