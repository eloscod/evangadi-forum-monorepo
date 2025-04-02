import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getQuestions } from "../../services/QuestionSercive";
import { User, ChevronRight } from "react-feather";
import styles from "./Home.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Client-side pagination state
  const [page, setPage] = useState(1);
  const limit = 5; // Number of questions per page

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getQuestions(); // Assume API returns all questions
        setQuestions(data.questions || []);
      } catch (err) {
        if (err.response && err.response.data) {
          setError(
            err.response.data.message ||
              "You must have an account to load questions!"
          );
        } else {
          setError("Something went wrong while loading questions.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Filter questions based on search term
  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages based on filtered questions
  const totalPages = Math.ceil(filteredQuestions.length / limit);

  // Slice the filtered questions for current page
  const currentQuestions = filteredQuestions.slice(
    (page - 1) * limit,
    page * limit
  );

  const handlePageChange = (newPage, e) => {
    e.preventDefault();
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className={styles.homeWrapper}>
      <ToastContainer />
      <div className={styles.topRow}>
        {user ? (
          <Link to="/ask-question">
            <button className={styles.askButton}>Ask Question</button>
          </Link>
        ) : (
          <Link to="/login">
            <button className={styles.askButton}>Log in to Ask</button>
          </Link>
        )}
        <span className={styles.welcome}>
          Welcome:{" "}
          <span className={styles.userName}>
            {user ? user.username : "Guest"}
          </span>
        </span>
      </div>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}

      <input
        type="text"
        placeholder="Search question"
        className={styles.searchBar}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Reset to page 1 when search changes
        }}
      />

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.questionList}>
        {loading ? (
          <p className={styles.loading}>Loading questions...</p>
        ) : currentQuestions.length === 0 && !error ? (
          <p className={styles.noQuestions}>No questions available yet.</p>
        ) : (
          currentQuestions.map((q) => (
            <div key={q.question_id} className={styles.questionItem}>
              <Link
                to={`/questions/${q.question_id}`}
                className={styles.questionLink}
                aria-label={`View question: ${q.title} by ${q.username}`}
              >
                <div className={styles.questionContent}>
                  <div className={styles.userIcon}>
                    <User size={24} />
                  </div>
                  <div className={styles.questionDetails}>
                    <p className={styles.questionTitle}>{q.title}</p>
                    <p className={styles.username}>{q.username}</p>
                  </div>
                  <div className={styles.arrow}>
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={(e) => handlePageChange(page - 1, e)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={(e) => handlePageChange(page + 1, e)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
