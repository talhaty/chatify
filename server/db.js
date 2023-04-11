const { Pool } = require("pg");

// connect to db
const pool = new Pool({
  user: "postgres", // add own username for testing
  host: "34.172.25.238",
  database: "chattyfai", // add db name running locally
  password: "batman123",
  port: 5432,
});

module.exports = { pool };
