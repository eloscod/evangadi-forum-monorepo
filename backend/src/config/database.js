// Import the MySQL library for Node.js
const mysql2 = require("mysql2");

// Import the filesystem library
const fs = require("fs");

// Load environment variables (e.g., DB_USER, DB_PASSWORD)
require("dotenv").config();

// Create a MySQL connection pool for efficient database access
const dbConnection = mysql2.createPool({
  user: process.env.DB_USER, // Database user
  database: process.env.DB_NAME, // Database name
  host: process.env.DB_HOST, // Database host
  password: process.env.DB_PASSWORD, // Database password
  connectionLimit: 10, // Maximum number of concurrent connections
  ssl: {
    ca: fs.readFileSync(process.env.DB_CA),
  },
  connectTimeout: 5000,
});

console.log("🌐 DB_HOST:", process.env.DB_HOST);
console.log("🔐 DB_USER:", process.env.DB_USER);

// Test the database connection on startup
dbConnection.getConnection((err, connection) => {
  if (err) {
    // Log error if connection fails
    console.error("❌ Error connecting to the database:", err.message);
    return;
  }
  console.log("✅ Successfully connected to the database!");
  connection.release(); // Release the connection back to the pool
});

// Handle connection errors (e.g., if the database goes down)
dbConnection.on("error", (err) => {
  console.error("❌ Database connection error:", err.message);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Attempting to reconnect...");
    // Add reconnection logic here if needed
  }
});

// Export the connection pool with promise support for async/await
module.exports = dbConnection.promise();
