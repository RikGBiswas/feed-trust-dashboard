const { Pool } = require("pg");

const schema = process.env.DB_SCHEMA || "public";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.DB_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

// Set search_path to the configured schema on every new client
pool.on("connect", (client) => {
  client.query(`SET search_path TO ${schema}`);
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

module.exports = pool;
