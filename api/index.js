const db = require("./models");
const routes = require("./routes");
const express = require("express");
const cors = require("cors");

const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use("/api", routes);

db.sequelize.sync().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});
