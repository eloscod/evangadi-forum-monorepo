// Import required packages
const { StatusCodes } = require("http-status-codes"); // HTTP status codes
const jwt = require("jsonwebtoken"); // Library for JWT token handling

// Middleware to authenticate requests using JWT tokens
async function authMiddleware(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is missing or malformed
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authorization header missing or malformed",
    });
  }

  // Extract the token from the header (format: "Bearer <token>")
  const token = authHeader.split(" ")[1];

  // Ensure JWT_SECRET is defined in environment variables
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Server configuration error",
    });
  }

  try {
    // Verify the token and extract the payload (username and userid)
    const { username, userid } = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request object for use in controllers
    req.user = { username, userid };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid token",
      });
    }

    // Handle any other authentication errors
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "Authentication failed",
    });
  }
}

// Export the middleware
module.exports = authMiddleware;
