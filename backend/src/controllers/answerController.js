// Import required dependencies
const { StatusCodes } = require("http-status-codes"); // For HTTP status codes
const dbConnection = require("../config/database"); // Database connection

// Controller to fetch all answers for a specific question (Public route)
async function getAnswersForQuestions(req, res) {
  try {
    const { question_id } = req.params;

    if (!question_id || isNaN(question_id) || parseInt(question_id) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide a valid question ID",
      });
    }

    const [question] = await dbConnection.query(
      `SELECT question_id FROM questionTable WHERE question_id = ?`,
      [question_id]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The question ID does not exist",
      });
    }

    const [answers] = await dbConnection.query(
      `
      SELECT 
        a.answer_id,
        a.answer,
        a.created_at,
        a.user_id,
        u.user_name AS username,
        COALESCE(SUM(v.vote_value), 0) AS vote_count
      FROM answerTable a
      LEFT JOIN userTable u ON a.user_id = u.user_id
      LEFT JOIN voteTable v ON a.answer_id = v.answer_id AND v.question_id IS NULL
      WHERE a.question_id = ?
      GROUP BY a.answer_id
      ORDER BY a.created_at DESC
      `,
      [question_id]
    );

    const formattedAnswers = answers.map((answer) => ({
      ...answer,
      created_at: new Date(answer.created_at).toLocaleString(),
      username: answer.username || "Anonymous", // Fallback if username is null
    }));

    return res.status(StatusCodes.OK).json({
      message: "All answers retrieved successfully",
      answers: formattedAnswers,
    });
  } catch (error) {
    console.error("❌ Error fetching answers:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching answers",
    });
  }
}

// Controller to post a new answer to a question (Protected route)
async function postAnswersForQuestions(req, res) {
  try {
    // Extract answer and question_id from the request body
    const { answer, question_id } = req.body;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid;

    // Validate that answer and question_id are provided
    if (!answer || !question_id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide both answer and question_id",
      });
    }

    // Validate answer length (between 10 and 1000 characters)
    if (answer.trim().length < 10 || answer.trim().length > 1000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Answer must be between 10 and 1000 characters",
      });
    }

    // Validate question_id (must be a positive integer)
    if (isNaN(question_id) || parseInt(question_id) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide a valid question ID",
      });
    }

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "User authentication required",
      });
    }

    // Check if the question exists
    const [question] = await dbConnection.query(
      `SELECT question_id FROM questionTable WHERE question_id = ?`,
      [question_id]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The question ID does not exist",
      });
    }

    // Insert the new answer into the database
    const [result] = await dbConnection.query(
      `
        INSERT INTO answerTable (user_id, question_id, answer)
        VALUES (?, ?, ?)
      `,
      [userId, question_id, answer]
    );

    // Return success response with the new answer's ID
    return res.status(StatusCodes.CREATED).json({
      message: "Answer created successfully",
      answer_id: result.insertId,
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error posting answer:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
}

// Controller to update an answer (Protected route)
async function updateAnswer(req, res) {
  try {
    // Extract answer_id from URL parameters
    const { answer_id } = req.params;
    // Extract answer from the request body
    const { answer } = req.body;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid;

    // Validate answer_id (must be a positive integer)
    if (!answer_id || isNaN(answer_id) || parseInt(answer_id) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Invalid answer ID",
      });
    }

    // Validate that answer is provided
    if (!answer) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide the updated answer",
      });
    }

    // Validate answer length (between 10 and 1000 characters)
    if (answer.trim().length < 10 || answer.trim().length > 1000) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Answer must be between 10 and 1000 characters",
      });
    }

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "User authentication required",
      });
    }

    // Check if the answer exists and belongs to the authenticated user
    const [answerRecord] = await dbConnection.query(
      "SELECT * FROM answerTable WHERE answer_id = ? AND user_id = ?",
      [answer_id, userId]
    );

    if (!answerRecord.length) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        message: "You can only update your own answers",
      });
    }

    // SQL query to update the answer
    const updateQuery = `
      UPDATE answerTable 
      SET answer = ?
      WHERE answer_id = ?
    `;
    await dbConnection.query(updateQuery, [answer, answer_id]);

    // Return success response
    return res.status(StatusCodes.OK).json({
      message: "Answer updated successfully",
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error updating answer:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
}

// Controller to delete an answer (Protected route)
async function deleteAnswer(req, res) {
  try {
    // Extract answer_id from URL parameters
    const { answer_id } = req.params;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid;

    // Validate answer_id (must be a positive integer)
    if (!answer_id || isNaN(answer_id) || parseInt(answer_id) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Invalid answer ID",
      });
    }

    // Ensure the user is authenticated
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Unauthorized",
        message: "User authentication required",
      });
    }

    // Check if the answer exists and belongs to the authenticated user
    const [answer] = await dbConnection.query(
      "SELECT * FROM answerTable WHERE answer_id = ? AND user_id = ?",
      [answer_id, userId]
    );

    if (!answer.length) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: "Forbidden",
        message: "You can only delete your own answers",
      });
    }

    // SQL query to delete the answer
    // Note: Associated votes will be deleted automatically due to ON DELETE CASCADE
    const deleteQuery = `
      DELETE FROM answerTable 
      WHERE answer_id = ?
    `;
    await dbConnection.query(deleteQuery, [answer_id]);

    // Return success response
    return res.status(StatusCodes.OK).json({
      message: "Answer deleted successfully",
    });
  } catch (err) {
    // Log the error for debugging and return a generic error response
    console.error("❌ Error deleting answer:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
}

// Export the controller functions
module.exports = {
  getAnswersForQuestions,
  postAnswersForQuestions,
  updateAnswer,
  deleteAnswer,
};
