// Import required dependencies
const express = require("express");
const router = express.Router();

// Import controller functions
const { voteQuestion, voteAnswer } = require("../controllers/voteController");

// Import authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes (require authentication)
router.post("/question/:question_id", authMiddleware, voteQuestion); // POST /api/vote/question/:question_id - Vote on a question
router.post("/answer/:answer_id", authMiddleware, voteAnswer); // POST /api/vote/answer/:answer_id - Vote on an answer

// Export the router
module.exports = router;
