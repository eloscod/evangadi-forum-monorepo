// Import required dependencies
const express = require("express");
const router = express.Router();

// Import controller functions
const {
  postQuestion,
  getQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questionController");

// Import authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// Public routes (no authentication required)
router.get("/", getQuestions); // GET /api/questions - Fetch all questions
router.get("/:question_id", getSingleQuestion); // GET /api/questions/:question_id - Fetch a single question

// Protected routes (require authentication)
router.post("/", authMiddleware, postQuestion); // POST /api/questions - Create a new question
router.put("/:question_id", authMiddleware, updateQuestion); // PUT /api/questions/:question_id - Update a question
router.delete("/:question_id", authMiddleware, deleteQuestion); // DELETE /api/questions/:question_id - Delete a question

// Export the router
module.exports = router;
