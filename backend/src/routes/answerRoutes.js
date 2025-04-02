// Import required packages
const express = require("express");
const router = express.Router();

// Import middleware to protect routes
const authMiddleware = require("../middleware/authMiddleware");

// Import controller functions for answer endpoints
const {
  getAnswersForQuestions,
  postAnswersForQuestions,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/answerController");

// ===============================
// ✅ ANSWER ROUTES
// ===============================

// Route to get all answers for a specific question (public)
router.get("/:question_id", getAnswersForQuestions);

// Route to post a new answer to a question (requires authentication)
router.post("/", authMiddleware, postAnswersForQuestions);
router.put("/:answer_id", authMiddleware, updateAnswer);
router.delete("/:answer_id", authMiddleware, deleteAnswer);

// ===============================

// Export the router
module.exports = router;
