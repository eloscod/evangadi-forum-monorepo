// Import required dependencies
const { StatusCodes } = require("http-status-codes"); // For HTTP status codes
const dbConnection = require("../config/database"); // Database connection

// Controller to post a new question (Protected route)
const postQuestion = async (req, res) => {
  try {
    // Extract title and description from the request body
    const { title, description } = req.body;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid; // Note: 'userid' should match the key in your JWT payload

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "User authentication required",
      });
    }

    // Validate that title and description are provided
    if (!title || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide both title and description",
      });
    }

    // Validate title length (between 5 and 100 characters)
    if (title.length < 5 || title.length > 100) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Title must be between 5 and 100 characters",
      });
    }

    // Validate description length (between 10 and 1000 characters)
    if (description.length < 10 || description.length > 1000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Description must be between 10 and 1000 characters",
      });
    }

    // SQL query to insert the new question into the database
    const insertQuery = `
      INSERT INTO questionTable (user_id, title, description)
      VALUES (?, ?, ?)
    `;
    const [result] = await dbConnection.query(insertQuery, [
      userId,
      title,
      description,
    ]);

    // Return success response with the new question's ID
    return res.status(StatusCodes.CREATED).json({
      message: "Question created successfully",
      question_id: result.insertId,
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error posting question:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to fetch all questions (Public route)
const getQuestions = async (req, res) => {
  try {
    // SQL query to fetch all questions with the username of the poster and total vote count
    const query = `
      SELECT 
        q.question_id,
        q.title,
        q.description,
        u.user_name AS username,
        q.created_at,
        COALESCE(SUM(v.vote_value), 0) AS vote_count
      FROM questionTable q
      JOIN userTable u ON q.user_id = u.user_id
      LEFT JOIN voteTable v ON q.question_id = v.question_id AND v.answer_id IS NULL
      GROUP BY q.question_id
      ORDER BY q.created_at DESC
    `;

    const [results] = await dbConnection.query(query);

    // Check if any questions exist
    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "No questions found",
      });
    }

    // Format the created_at timestamp for better readability
    const formattedResults = results.map((question) => ({
      ...question,
      created_at: new Date(question.created_at).toLocaleString(),
    }));

    // Return the questions with vote counts in the response
    return res.status(StatusCodes.OK).json({
      message: "All questions retrieved successfully",
      questions: formattedResults,
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error fetching questions:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching questions",
    });
  }
};

// Controller to fetch a single question by ID (Public route)
const getSingleQuestion = async (req, res) => {
  try {
    // Extract question_id from URL parameters
    const questionId = req.params.question_id;

    // Validate question_id (must be a positive integer)
    if (!questionId || isNaN(questionId) || parseInt(questionId) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide a valid question ID",
      });
    }

    // SQL query to fetch the question with the username of the poster and total vote count
    const questionQuery = `
      SELECT 
        q.question_id,
        q.title,
        q.description,
        u.user_name AS username,
        q.created_at,
        COALESCE(SUM(v.vote_value), 0) AS vote_count
      FROM questionTable q
      JOIN userTable u ON q.user_id = u.user_id
      LEFT JOIN voteTable v ON q.question_id = v.question_id AND v.answer_id IS NULL
      WHERE q.question_id = ?
      GROUP BY q.question_id
    `;

    const [results] = await dbConnection.query(questionQuery, [questionId]);

    // Check if the question exists
    if (results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found",
      });
    }

    // Format the created_at timestamp for better readability
    const formatted = {
      ...results[0],
      created_at: new Date(results[0].created_at).toLocaleString(),
    };

    // Return the question with vote count in the response
    return res.status(StatusCodes.OK).json({
      message: "Question retrieved successfully",
      question: formatted,
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error fetching question:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to update a question (Protected route)
const updateQuestion = async (req, res) => {
  try {
    // Extract question_id from URL parameters
    const { question_id } = req.params;
    // Extract title and description from the request body
    const { title, description } = req.body;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid;

    // Validate question_id (must be a positive integer)
    if (!question_id || isNaN(question_id) || parseInt(question_id) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Invalid question ID",
      });
    }

    // Validate that title and description are provided
    if (!title || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide both title and description",
      });
    }

    // Validate title length (between 5 and 100 characters)
    if (title.length < 5 || title.length > 100) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Title must be between 5 and 100 characters",
      });
    }

    // Validate description length (between 10 and 1000 characters)
    if (description.length < 10 || description.length > 1000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Description must be between 10 and 1000 characters",
      });
    }

    // Check if the question exists and belongs to the authenticated user
    const [question] = await dbConnection.query(
      "SELECT * FROM questionTable WHERE question_id = ? AND user_id = ?",
      [question_id, userId]
    );

    if (!question.length) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        message: "You can only update your own questions",
      });
    }

    // SQL query to update the question
    const updateQuery = `
      UPDATE questionTable 
      SET title = ?, description = ?
      WHERE question_id = ?
    `;
    await dbConnection.query(updateQuery, [title, description, question_id]);

    // Return success response
    return res.status(StatusCodes.OK).json({
      message: "Question updated successfully",
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error updating question:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to delete a question (Protected route)
const deleteQuestion = async (req, res) => {
  try {
    // Extract question_id from URL parameters
    const { question_id } = req.params;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid;

    // Validate question_id (must be a positive integer)
    if (!question_id || isNaN(question_id) || parseInt(question_id) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Invalid question ID",
      });
    }

    // Check if the question exists and belongs to the authenticated user
    const [question] = await dbConnection.query(
      "SELECT * FROM questionTable WHERE question_id = ? AND user_id = ?",
      [question_id, userId]
    );

    if (!question.length) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        message: "You can only delete your own questions",
      });
    }

    // SQL query to delete the question
    // Note: Associated answers and votes will be deleted automatically due to ON DELETE CASCADE
    const deleteQuery = `
      DELETE FROM questionTable 
      WHERE question_id = ?
    `;
    await dbConnection.query(deleteQuery, [question_id]);

    // Return success response
    return res.status(StatusCodes.OK).json({
      message: "Question deleted successfully",
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error deleting question:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Export the controller functions
module.exports = {
  postQuestion,
  getQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
