// Import the MySQL library with promise support
const mysql2 = require("mysql2/promise");

// Load environment variables
require("dotenv").config();

// Function to create a single MySQL connection for setup
const setupConnection = async () => {
  return await mysql2.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

// Function to create the database tables
const createTables = async () => {
  const connection = await setupConnection();

  try {
    // SQL query to create the userTable
    const createUserTable = `
      CREATE TABLE IF NOT EXISTS userTable (
        user_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each user
        user_name VARCHAR(255) NOT NULL UNIQUE COLLATE utf8mb4_unicode_ci, -- Username (case-insensitive)
        first_name VARCHAR(50) NOT NULL, -- User's first name
        last_name VARCHAR(50) NOT NULL, -- User's last name
        email VARCHAR(255) NOT NULL UNIQUE COLLATE utf8mb4_unicode_ci, -- Email (case-insensitive)
        password VARCHAR(255) NOT NULL, -- Hashed password
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Creation timestamp
      )
    `;

    // SQL query to create the questionTable
    const createQuestionTable = `
      CREATE TABLE IF NOT EXISTS questionTable (
        question_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each question
        user_id INT, -- ID of the user who posted the question
        title VARCHAR(255) NOT NULL, -- Question title
        description TEXT NOT NULL, -- Question description
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
        FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE -- Foreign key to userTable
      )
    `;

    // SQL query to create the answerTable
    const createAnswerTable = `
      CREATE TABLE IF NOT EXISTS answerTable (
        answer_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each answer
        user_id INT, -- ID of the user who posted the answer
        question_id INT, -- ID of the question being answered
        answer TEXT NOT NULL, -- Answer text
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
        FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE, -- Foreign key to userTable
        FOREIGN KEY (question_id) REFERENCES questionTable(question_id) ON DELETE CASCADE -- Foreign key to questionTable
      )
    `;

    // SQl query to create the upvoteTable
    const createVoteTable = `
  CREATE TABLE IF NOT EXISTS voteTable (
    vote_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each vote
    user_id INT, -- ID of the user who voted
    question_id INT, -- ID of the question being voted on (NULL if voting on an answer)
    answer_id INT, -- ID of the answer being voted on (NULL if voting on a question)
    vote_value INT NOT NULL, -- 1 for upvote, -1 for downvote
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE, -- Foreign key to userTable
    FOREIGN KEY (question_id) REFERENCES questionTable(question_id) ON DELETE CASCADE, -- Foreign key to questionTable
    FOREIGN KEY (answer_id) REFERENCES answerTable(answer_id) ON DELETE CASCADE, -- Foreign key to answerTable
    CONSTRAINT unique_vote UNIQUE (user_id, question_id, answer_id), -- Ensure a user can only vote once per question/answer
    CONSTRAINT check_vote_value CHECK (vote_value IN (1, -1)) -- Ensure vote_value is either 1 or -1
  )
`;

    // Execute the table creation queries in sequence
    await connection.query(createUserTable);
    console.log("✅ userTable created successfully");

    await connection.query(createQuestionTable);
    console.log("✅ questionTable created successfully");

    await connection.query(createAnswerTable);
    console.log("✅ answerTable created successfully");

    // Excute the table creation queries in sequence for upvoteTable
    await connection.query(createVoteTable);
    console.log("✅ voteTable created successfully");

    console.log("✅ All tables created successfully!");
  } catch (err) {
    // Log any errors during table creation
    console.error("❌ Error creating tables:", err.message);
  } finally {
    // Close the connection
    await connection.end();
  }
};

// Run the table creation script
createTables();
