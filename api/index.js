const { authenticateUser } = require("./middlewares");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const JWT_SECRET = "your_jwt_secret";

const pool = require("./database");

app.post("/api/register", async (req, res) => {
	const client = await pool.connect();
	try {
		const { username, password } = req.body;
		const { rows } = await client.query("SELECT * FROM users");
		const existingUser = rows.find((user) => user.username === username);

		if (existingUser) {
			return res.status(400).json({
				message: `O usuário '${username}' já existe no nosso banco de dados.`,
			});
		}

		const query = "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id";
		const insertResult = await client.query(query, [username, password]);
		const userId = insertResult.rows[0].id;
		const token = jwt.sign({ userId, username }, JWT_SECRET, {
			expiresIn: "3h",
		});

		res.status(201).json({
			user: { userId, username, password },
			token,
			message: "Usuário registrado com sucesso.",
		});
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		await client.end();
	}
});

app.post("/api/login", async (req, res) => {
	const client = await pool.connect();
	try {
		const { username, password } = req.body;
		const query = `SELECT * FROM users WHERE username = '${username}'`;
		const { rows } = await client.query(query);
		console.log(rows)
		if (rows.length === 0) {
			res.status(401).json({ message: "Invalid username" });
		}

		const user = { username: rows[0].username, password: rows[0].password };

		if (user.password !== password) {
			res.status(401).json({ message: "Invalid password" });
		}

		const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "3h" });
		res.json({ token });
	} catch (error) {
		console.error(`Error in /api/login: ${error}`);
		res.status(500).send({ message: "Internal Server Error" });
	} finally {
		await client.end();
	}
});

app.get("/api/smartphones", authenticateUser, async (req, res) => {
	const client = await pool.connect();
	try {
		const results = await client.query("SELECT * FROM smartphones");
		console.log(results);
		res.json(results.rows);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: "Error retrieving smartphones" });
	} finally {
		await client.end();
	}
});

app.get("/api/smartphones/:id", authenticateUser, (req, res) => {
	const itemId = parseInt(req.params.id);
	const item = smartphones.find((item) => item.id === itemId);
	if (!item) {
		return res.status(404).json({ message: "Item not found" });
	}
	res.json(item);
});

app.post("/api/smartphones", authenticateUser, (req, res) => {
	const newItem = req.body;
	newItem.id = Date.now(); //TODO: manter esse id?
	smartphones.push(newItem);
	res.status(201).json(newItem);
});

app.put("/api/smartphones/:id", authenticateUser, (req, res) => {
	const itemId = parseInt(req.params.id);
	const itemIndex = smartphones.findIndex((item) => item.id === itemId);
	if (itemIndex === -1) {
		return res.status(404).json({ message: "Item not found" });
	}
	const updatedItem = { ...smartphones[itemIndex], ...req.body };
	smartphones[itemIndex] = updatedItem;
	res.json(updatedItem);
});

app.delete("/api/smartphones/:id", authenticateUser, (req, res) => {
	const itemId = parseInt(req.params.id);
	smartphones = smartphones.filter((item) => item.id !== itemId);
	res.sendStatus(204); // No content
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
