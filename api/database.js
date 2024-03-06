
const pg = require('pg');
require('dotenv').config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

pool.connect((err) => {
	if (err) throw err;
	console.log("Connected to Postgre");
});

module.exports = pool;
