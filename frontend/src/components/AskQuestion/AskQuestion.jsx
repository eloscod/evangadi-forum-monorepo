import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { postQuestion } from "../../components/services/QuestionSercive";
import styles from "./AskQuestion.module.css";

const AskQuestion = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: { errorMessage: "Please log in to ask a question." },
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Both title and description are required.");
      return;
    }

    setLoading(true);
    try {
      await postQuestion({
        title: formData.title,
        description: formData.description,
      });
      navigate("/home", {
        state: { successMessage: "Question posted successfully!" },
      });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "Failed to post question. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.instructionBox}>
        <h2>
          Steps To Write <span className={styles.highlight}>A Good</span>{" "}
          Question.
        </h2>
        <ul className={styles.instructions}>
          <li>🔹 Summarize your problem in a one-line title.</li>
          <li>🔹 Describe your problem in more detail.</li>
          <li>🔹 Explain what you tried and what you expected to happen.</li>
          <li>🔹 Review your question and post it.</li>
        </ul>
      </div>

      <h3 className={styles.formTitle}>Post Your Question</h3>

      {error && <p className={styles.errorMessage}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="title"
          placeholder="Question title"
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
          aria-label="Question title"
          required
          autoFocus
        />

        <textarea
          name="description"
          placeholder="Question detail ..."
          rows={6}
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          aria-label="Question description"
          required
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Question"}
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;
