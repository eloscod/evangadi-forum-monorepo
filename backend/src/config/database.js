const mysql2 = require("mysql2");
const fs = require("fs");
require("dotenv").config();

console.log("🌐 DB_HOST:", process.env.DB_HOST);
console.log("🔐 DB_USER:", process.env.DB_USER);
console.log("📄 DB_CA Path from .env:", process.env.DB_CA);

let sslOptions = null;

// Only apply SSL if NOT using localhost and the CA file exists
if (
  process.env.DB_HOST !== "localhost" &&
  process.env.DB_CA &&
  fs.existsSync(process.env.DB_CA)
) {
  console.log("📄 File exists: true");
  const caContent = fs.readFileSync(process.env.DB_CA);
  console.log("🔐 SSL CA content length:", caContent.length);
  sslOptions = { ca: caContent };
} else {
  console.log("Skipping SSL: not required for localhost or file not found");
}

const dbConnection = mysql2.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: sslOptions,
  connectTimeout: 3000,
  connectionLimit: 10,
});

// Test the DB connection
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error connecting to the database:", err.message);
    console.error("❌ Full error details:", err);
    throw new Error("Failed to connect to DB: " + err.message);
  }
  console.log("✅ Successfully connected to the database!");
  connection.release();
});

module.exports = dbConnection.promise();
