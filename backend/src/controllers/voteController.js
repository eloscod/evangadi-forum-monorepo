// Import required dependencies
const { StatusCodes } = require("http-status-codes"); // For HTTP status codes
const dbConnection = require("../config/database"); // Database connection

// Controller to vote on a question (upvote or downvote) (Protected route)
const voteQuestion = async (req, res) => {
  try {
    // Extract question_id from URL parameters
    const { question_id } = req.params;
    // Extract vote_value from the request body (1 for upvote, -1 for downvote)
    const { vote_value } = req.body;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid;

    // Validate question_id (must be a positive integer)
    if (!question_id || isNaN(question_id) || parseInt(question_id, 10) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Invalid question ID",
      });
    }

    // Validate vote_value (must be 1 or -1)
    if (vote_value !== 1 && vote_value !== -1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Vote value must be 1 (upvote) or -1 (downvote)",
      });
    }

    // Check if the question exists
    const [question] = await dbConnection.query(
      "SELECT * FROM questionTable WHERE question_id = ?",
      [question_id]
    );

    if (!question.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "Question not found",
      });
    }

    // Check if the user has already voted on this question
    const [existingVote] = await dbConnection.query(
      "SELECT * FROM voteTable WHERE user_id = ? AND question_id = ? AND answer_id IS NULL",
      [userId, question_id]
    );

    if (existingVote.length) {
      // If the user has already voted with the same value, remove the vote
      if (existingVote[0].vote_value === vote_value) {
        await dbConnection.query(
          "DELETE FROM voteTable WHERE user_id = ? AND question_id = ? AND answer_id IS NULL",
          [userId, question_id]
        );
      } else {
        // Update the existing vote to the new value
        await dbConnection.query(
          "UPDATE voteTable SET vote_value = ? WHERE user_id = ? AND question_id = ? AND answer_id IS NULL",
          [vote_value, userId, question_id]
        );
      }
    } else {
      // Insert a new vote for the question
      await dbConnection.query(
        "INSERT INTO voteTable (user_id, question_id, vote_value) VALUES (?, ?, ?)",
        [userId, question_id, vote_value]
      );
    }

    // Calculate the updated vote count for the question
    const [result] = await dbConnection.query(
      `SELECT COALESCE(SUM(v.vote_value), 0) AS vote_count 
       FROM voteTable v 
       WHERE v.question_id = ? AND v.answer_id IS NULL`,
      [question_id]
    );

    return res.status(StatusCodes.OK).json({
      message: "Vote recorded successfully",
      vote_count: result[0].vote_count,
    });
  } catch (err) {
    console.error("❌ Error voting on question:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Controller to vote on an answer (upvote or downvote) (Protected route)
const voteAnswer = async (req, res) => {
  try {
    // Extract answer_id from URL parameters
    const { answer_id } = req.params;
    // Extract vote_value from the request body (1 for upvote, -1 for downvote)
    const { vote_value } = req.body;
    // Get the user ID from the authenticated user (set by authMiddleware)
    const userId = req.user?.userid;

    // Validate answer_id (must be a positive integer)
    if (!answer_id || isNaN(answer_id) || parseInt(answer_id, 10) <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Invalid answer ID",
      });
    }

    // Validate vote_value (must be 1 or -1)
    if (vote_value !== 1 && vote_value !== -1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Vote value must be 1 (upvote) or -1 (downvote)",
      });
    }

    // Check if the answer exists
    const [answer] = await dbConnection.query(
      "SELECT * FROM answerTable WHERE answer_id = ?",
      [answer_id]
    );

    if (!answer.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "Answer not found",
      });
    }

    // Check if the user has already voted on this answer
    const [existingVote] = await dbConnection.query(
      "SELECT * FROM voteTable WHERE user_id = ? AND answer_id = ? AND question_id IS NULL",
      [userId, answer_id]
    );

    if (existingVote.length) {
      // If the user has already voted with the same value, remove the vote
      if (existingVote[0].vote_value === vote_value) {
        await dbConnection.query(
          "DELETE FROM voteTable WHERE user_id = ? AND answer_id = ? AND question_id IS NULL",
          [userId, answer_id]
        );
      } else {
        // Update the existing vote to the new value
        await dbConnection.query(
          "UPDATE voteTable SET vote_value = ? WHERE user_id = ? AND answer_id = ? AND question_id IS NULL",
          [vote_value, userId, answer_id]
        );
      }
    } else {
      // Insert a new vote for the answer
      await dbConnection.query(
        "INSERT INTO voteTable (user_id, answer_id, vote_value) VALUES (?, ?, ?)",
        [userId, answer_id, vote_value]
      );
    }

    // Calculate the updated vote count for the answer
    const [result] = await dbConnection.query(
      `SELECT COALESCE(SUM(v.vote_value), 0) AS vote_count 
       FROM voteTable v 
       WHERE v.answer_id = ? AND v.question_id IS NULL`,
      [answer_id]
    );

    return res.status(StatusCodes.OK).json({
      message: "Vote recorded successfully",
      vote_count: result[0].vote_count,
    });
  } catch (err) {
    console.error("❌ Error voting on answer:", err.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  }
};

// Export the controller functions
module.exports = {
  voteQuestion,
  voteAnswer,
};
