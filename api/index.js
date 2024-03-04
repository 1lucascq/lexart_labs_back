const { authenticateUser } = require("./middlewares");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

const JWT_SECRET = "your_jwt_secret";
const items = [
	{ id: 1, name: "Item 1" },
	{ id: 2, name: "Item 2" },
	{ id: 3, name: "Item 3" },
];

const users = [{ id: 1, username: "user", password: "password" }];

app.post("/api/register", (req, res) => {
	const { username, password } = req.body;
	const existingUser = users.find((user) => user.username === username);

	if (existingUser) {
		return res.status(400).json({ message: "Username already exists" });
	}

	const newUser = {
		id: Date.now(),
		username,
		password,
	};

	users.push(newUser);

	const token = jwt.sign(
		{ userId: newUser.id, username: newUser.username },
		JWT_SECRET,
		{ expiresIn: "1h" }
	);
	res.status(201).json({ token });
});

app.post("/api/login", (req, res) => {
	const { username, password } = req.body;
	const user = users.find(
		(user) => user.username === username && user.password === password
	);

	if (!user) {
		return res
			.status(401)
			.json({ message: "Invalid username or password" });
	}

	const token = jwt.sign(
		{ userId: user.id, username: user.username },
		JWT_SECRET,
		{ expiresIn: "24h" }
	);
	res.json({ token });
});

app.get("/", authenticateUser, (req, res) => {
	res.json({ oi: "oi" });
});

app.get("/api/items", authenticateUser, (req, res) => {
	res.json(items);
});

app.get("/api/items/:id", authenticateUser, (req, res) => {
	const itemId = parseInt(req.params.id);
	const item = items.find((item) => item.id === itemId);
	if (!item) {
		return res.status(404).json({ message: "Item not found" });
	}
	res.json(item);
});

app.post("/api/items", authenticateUser, (req, res) => {
	const newItem = req.body;
	newItem.id = Date.now(); //TODO: manter esse id?
	items.push(newItem);
	res.status(201).json(newItem);
});

app.put("/api/items/:id", authenticateUser, (req, res) => {
	const itemId = parseInt(req.params.id);
	const itemIndex = items.findIndex((item) => item.id === itemId);
	if (itemIndex === -1) {
		return res.status(404).json({ message: "Item not found" });
	}
	const updatedItem = { ...items[itemIndex], ...req.body };
	items[itemIndex] = updatedItem;
	res.json(updatedItem);
});

app.delete("/api/items/:id", authenticateUser, (req, res) => {
	const itemId = parseInt(req.params.id);
	items = items.filter((item) => item.id !== itemId);
	res.sendStatus(204); // No content
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
