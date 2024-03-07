const Sequelize = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	dialect: "postgres",
    dialectModule: "pg",
	host: process.env.POSTGRES_HOST,
	port: 5432,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

const User = require("./users")(sequelize, Sequelize);
const Smartphone = require("./smartphones")(sequelize, Sequelize);

module.exports = {
	User,
	Smartphone,
	sequelize
};
