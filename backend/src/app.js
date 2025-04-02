// Load environment variables from .env file (e.g., PORT, JWT_SECRET, etc.)
require("dotenv").config();

// Import required packages
const express = require("express"); // Framework for building the server
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const rateLimit = require("express-rate-limit"); // Middleware to limit repeated requests
const morgan = require("morgan"); // Middleware for logging HTTP requests

// Initialize Express app
const app = express();

// Set the port from environment variables or default to 7700
const port = process.env.PORT;

// ============ MIDDLEWARE SETUP ============

// Enable CORS to allow the frontend to communicate with the backend
// Restrict to the frontend URL (e.g., http://localhost:5173) for security
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true,
  })
);

// Health
app.get("/health", (req, res) => {
  res.status(200).send("Backend is alive!");
});

// Parse incoming JSON payloads (e.g., from POST requests)
app.use(express.json());

// Log HTTP requests in development format (e.g., method, URL, status, response time)
app.use(morgan("dev"));

// Rate limiting for sensitive endpoints to prevent abuse
// Limit login attempts to 5 per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 5, // Max 5 requests per window
  message: {
    error: "Too Many Requests",
    message: "Too many login attempts, please try again later.",
  },
});

// Limit forgot-password requests to 3 per 15 minutes
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 3, // Max 3 requests per window
  message: {
    error: "Too Many Requests",
    message: "Too many password reset requests, please try again later.",
  },
});

// Apply rate limiting to specific routes
app.use("/api/users/login", loginLimiter);
app.use("/api/users/forgot-password", forgotPasswordLimiter);

// ============ DATABASE SETUP ============

// Import the MySQL database connection pool from config
const dbConnection = require("./config/database");

// ============ AUTH MIDDLEWARE ============

// Import middleware to protect routes by verifying JWT tokens
const authMiddleware = require("./middleware/authMiddleware");

// ============ ROUTE IMPORTS ============

// Import route handlers for user, question, and answer endpoints
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const voteRoutes = require("./routes/voteRoutes");

// ============ ROUTE SETUP ============

// Mount routes to their respective base paths
app.use("/api/users", userRoutes); // User routes (e.g., /api/users/register)
app.use("/api/questions", questionRoutes); // Question routes (e.g., /api/questions)
app.use("/api/answers", answerRoutes); // Answer routes (e.g., /api/answer/:question_id)
app.use("/api/vote", voteRoutes); // Vote routes (e.g., /api/vote)

// ============ SERVER STARTUP ============

// Async function to start the server
async function start() {
  try {
    // Test the database connection by running a simple query
    await dbConnection.execute("SELECT 1");
    console.log("✅ Database connection established");

    // Start the server and listen on the specified port
    app.listen(port, () => {
      console.log(`🚀 Server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    // Log and exit if the database connection fails
    console.error("❌ Failed to connect to DB:", error.message);
    process.exit(1); // Exit with failure code
  }
}

app.get("/", (req, res) => {
  res.send("🚀 Evangadi Forum Backend is Running!");
});

// Start the server
start();
