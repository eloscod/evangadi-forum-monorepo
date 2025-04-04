// Import required packages
const dbConnection = require("../config/database"); // Database connection
const { StatusCodes } = require("http-status-codes"); // HTTP status codes
const bcrypt = require("bcryptjs"); // Password hashing
const jwt = require("jsonwebtoken"); // JWT token generation
const sgMail = require("@sendgrid/mail"); // SendGrid for email sending

// Set the SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Controller to register a new user
const register = async (req, res) => {
  // Extract user details from the request body
  const { username, firstname, lastname, email, password } = req.body;

  // Validate that all required fields are provided
  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  // Validate username length (3-50 characters)
  if (username.length < 3 || username.length > 50) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Username must be between 3 and 50 characters",
    });
  }

  // Validate first name length (2-50 characters)
  if (firstname.length < 2 || firstname.length > 50) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "First name must be between 2 and 50 characters",
    });
  }

  // Validate last name length (2-50 characters)
  if (lastname.length < 2 || lastname.length > 50) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Last name must be between 2 and 50 characters",
    });
  }

  // Validate email format using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide a valid email address",
    });
  }

  // Validate password length (minimum 8 characters)
  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    // Check if the email already exists in the database
    const [userByEmail] = await dbConnection.query(
      "SELECT * FROM userTable WHERE email = ?",
      [email.toLowerCase()]
    );

    if (userByEmail.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "Email already exists",
      });
    }

    // Check if the username already exists in the database
    const [userByUsername] = await dbConnection.query(
      "SELECT * FROM userTable WHERE user_name = ?",
      [username.toLowerCase()]
    );

    if (userByUsername.length > 0) {
      return res.status(StatusCodes.CONFLICT).json({
        error: "Conflict",
        message: "Username already exists",
      });
    }

    // Hash the password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const [result] = await dbConnection.query(
      "INSERT INTO userTable (user_name, first_name, last_name, email, password) VALUES (?, ?, ?, ?, ?)",
      [
        username.toLowerCase(),
        firstname,
        lastname,
        email.toLowerCase(),
        hashedPassword,
      ]
    );

    // Create a user object to return in the response
    const newUser = {
      user_id: result.insertId,
      username: username.toLowerCase(),
      firstname,
      lastname,
      email: email.toLowerCase(),
    };

    // Send confirmation email using SendGrid
    const loginLink = `${process.env.FRONTEND_URL}/login`;
    const msg = {
      to: email,
      from: {
        email: "osydosam@gmail.com",
        name: "Evangadi Networks",
      },
      templateId: "d-ed5d3334eb534285bc6c65221c232c36",
      dynamic_template_data: {
        username: newUser.username,
        loginLink: loginLink,
      },
    };

    // Send the email using SendGrid
    await sgMail.send(msg);

    // Return success response
    res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    // Log and handle any errors
    console.error("Error in register:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to log in a user with additional debug logs
const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    console.log("Missing email or password in the request");
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide email and password",
    });
  }

  try {
    console.log("Attempting login for email:", email);

    // Query the database
    const [user] = await dbConnection.query(
      "SELECT * FROM userTable WHERE email = ?",
      [email.toLowerCase()]
    );
    console.log("User record from DB:", user);

    // Check if user is found
    if (!user || user.length === 0) {
      console.log("No user found with email:", email);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Verify that the password exists in the database
    const dbPassword = user[0].password;
    if (!dbPassword) {
      console.error("No password found in DB for user:", email);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: "Password missing from database",
      });
    }

    // Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, dbPassword);
    console.log("Password match result for email:", email, isMatch);

    if (!isMatch) {
      console.log("Incorrect password for email:", email);
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "Invalid email or password",
      });
    }

    // Generate a JWT token for the user
    const token = jwt.sign(
      {
        userid: user[0].user_id,
        username: user[0].user_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Token generated successfully for email:", email);
    return res.status(StatusCodes.OK).json({
      message: "User login successful",
      token,
      username: user[0].user_name,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: error.message || "An unexpected error occurred",
    });
  }
};

// Controller to check if a user is authenticated
const checkUser = async (req, res) => {
  try {
    // Return the authenticated user's info (set by authMiddleware)
    res.status(StatusCodes.OK).json({
      message: "Valid user",
      username: req.user.username,
      userid: req.user.userid,
    });
  } catch (error) {
    console.error("Error in checkUser:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to get the current user's info
const getCurrentUser = async (req, res) => {
  try {
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user.userid;

    // Fetch the user's info from the database
    const [user] = await dbConnection.query(
      "SELECT user_name, first_name, last_name, email FROM userTable WHERE user_id = ?",
      [userId]
    );

    // Check if the user exists
    if (user.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "User not found",
      });
    }

    // Return the user's info
    res.status(StatusCodes.OK).json({
      message: "User info retrieved successfully",
      username: user[0].user_name,
    });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to handle forgot-password requests
const forgotPassword = async (req, res) => {
  // Extract email from the request body
  const { email } = req.body;

  // Validate that email is provided
  if (!email) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide an email address",
    });
  }

  try {
    // Fetch the user by email from the database
    const [user] = await dbConnection.query(
      "SELECT * FROM userTable WHERE email = ?",
      [email.toLowerCase()]
    );

    // If the user doesn't exist, return a generic response (for security)
    if (user.length === 0) {
      return res.status(StatusCodes.OK).json({
        message: "If this email exists, a reset link will be sent.",
      });
    }

    // Generate a reset token with the user's ID
    const resetToken = jwt.sign(
      { userId: user[0].user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Create the password reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Define the email message using SendGrid
    const msg = {
      to: email, // Recipient email
      from: {
        email: "osydosam@gmail.com",
        name: "Evangadi Networks",
      }, // Verified sender email in SendGrid
      templateId: "d-0231287553ef41f6974b2015007d1f83", // Template ID from SendGrid
      dynamic_template_data: {
        subject: "Reset Your Password - Evangadi Forum",
        username: user[0].user_name,
        resetLink: resetLink,
      },
    };

    // Send the email using SendGrid
    await sgMail.send(msg);

    // Return success response (generic for security)
    res.status(StatusCodes.OK).json({
      message: "If this email exists, a reset link will be sent.",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to handle password reset requests
const resetPassword = async (req, res) => {
  // Extract the reset token from URL parameters and new password from the request body
  const { token } = req.params;
  const { password } = req.body;

  // Validate that a new password is provided
  if (!password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Please provide a new password",
    });
  }

  // Validate password length (minimum 8 characters)
  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Bad Request",
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user by ID
    const [user] = await dbConnection.query(
      "SELECT * FROM userTable WHERE user_id = ?",
      [userId]
    );

    // Check if the user exists
    if (user.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "Invalid or expired reset token",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    await dbConnection.query(
      "UPDATE userTable SET password = ? WHERE user_id = ?",
      [hashedPassword, userId]
    );

    // Send password reset confirmation email using SendGrid
    const loginLink = `${process.env.FRONTEND_URL}/login`;
    const msg = {
      to: user[0].email,
      from: {
        email: "osydosam@gmail.com",
        name: "Evangadi Networks",
      },
      templateId: "d-0d0f936116624f368682d725b0a96441",
      dynamic_template_data: {
        username: user[0].user_name,
        loginLink: loginLink,
      },
    };

    // Send the email using SendGrid
    await sgMail.send(msg);
    console.log(`Password reset confirmation email sent to ${user[0].email}`);

    // Return success response
    res.status(StatusCodes.OK).json({
      message:
        "Password reset successfully. A confirmation email has been sent.",
    });
  } catch (error) {
    // Handle specific JWT errors (expired or invalid token)
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Invalid or expired reset token",
      });
    }

    console.error("Error in resetPassword:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Export the controller functions
module.exports = {
  register,
  login,
  checkUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
