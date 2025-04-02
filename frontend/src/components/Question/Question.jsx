import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import {
  getQuestionById,
  getAnswersByQuestionId,
  postAnswer,
  deleteAnswer,
  updateAnswer,
  voteAnswer,
} from "../../components/services/QuestionSercive";
import { User, ThumbsUp, ThumbsDown, ChevronRight } from "react-feather";
import styles from "./Question.module.css";

const Question = () => {
  const { question_id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [userVotes, setUserVotes] = useState({});
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Pagination state for answers
  const [currentPage, setCurrentPage] = useState(1);
  const answersPerPage = 5; // Change as needed

  // Fetch question and answers when component mounts or question_id changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const parsedQuestionId = parseInt(question_id, 10);
        const [questionData, answersData] = await Promise.all([
          getQuestionById(parsedQuestionId),
          getAnswersByQuestionId(parsedQuestionId).catch((err) => {
            if (err.response && err.response.status === 404) {
              return [];
            }
            throw err;
          }),
        ]);
        console.log("Fetched question data:", questionData);
        console.log("Fetched answers data:", answersData);
        if (!questionData) {
          throw new Error("Question not found.");
        }
        setQuestion(questionData);
        setAnswers(Array.isArray(answersData) ? answersData : []);
        setCurrentPage(1); // Reset pagination when answers change
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError("Question not found.");
            navigate("/home", {
              state: {
                errorMessage: "The question you’re looking for does not exist.",
              },
            });
          } else if (err.response.status === 401) {
            setError("You are not authorized. Please log in again.");
            navigate("/login", {
              state: { errorMessage: "Session expired. Please log in again." },
            });
          } else {
            setError(err.response.data.message || "Failed to load question.");
          }
        } else {
          setError("Unable to connect to the server. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [question_id, navigate]);

  useEffect(() => {
    console.log("Current answers state:", answers);
  }, [answers]);

  // Calculate pagination indices
  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);
  const totalPages = Math.ceil(answers.length / answersPerPage);

  // Handle page change for answers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Submit a new answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", {
        state: { errorMessage: "Please log in to post an answer." },
      });
      return;
    }
    if (!newAnswer.trim()) {
      setError("Answer cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const parsedQuestionId = parseInt(question_id, 10);
      console.log("Posting answer for question_id:", parsedQuestionId);
      const newAnswerData = await postAnswer({
        question_id: parsedQuestionId,
        answer: newAnswer,
      });
      console.log("New answer data:", newAnswerData);

      const formattedAnswer = {
        answer_id: newAnswerData.answer_id,
        answer: newAnswerData.answer || newAnswer,
        created_at: newAnswerData.created_at || new Date().toLocaleString(),
        user_id: newAnswerData.user_id || user.user_id,
        username: newAnswerData.username || user.username,
        vote_count: newAnswerData.vote_count ?? 0,
      };

      setAnswers((prev) =>
        Array.isArray(prev) ? [...prev, formattedAnswer] : [formattedAnswer]
      );
      setNewAnswer("");
      setCurrentPage(1); // Reset to first page after adding new answer
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to post answer.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle editing an answer
  const handleEdit = (answer) => {
    setEditingAnswerId(answer.answer_id);
    setEditedAnswer(answer.answer);
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditedAnswer("");
  };

  const handleEditSubmit = async (e, answerId) => {
    e.preventDefault();
    if (!editedAnswer.trim()) {
      setError("Answer cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await updateAnswer(answerId, { answer: editedAnswer });
      setAnswers((prev) =>
        prev.map((a) =>
          a.answer_id === answerId ? { ...a, answer: editedAnswer } : a
        )
      );
      setEditingAnswerId(null);
      setEditedAnswer("");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to update answer.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an answer
  const handleDelete = async (answer_id) => {
    if (!window.confirm("Are you sure you want to delete this answer?")) return;

    setLoading(true);
    setError("");
    try {
      await deleteAnswer(answer_id);
      setAnswers((prev) => prev.filter((a) => a.answer_id !== answer_id));
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to delete answer.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle voting on an answer using like/dislike icons
  const handleVote = async (answerId, voteType) => {
    if (!user) {
      navigate("/login", {
        state: { errorMessage: "Please log in to vote." },
      });
      return;
    }

    setLoading(true);
    setError("");
    try {
      // voteType: 1 for like, -1 for dislike
      const response = await voteAnswer(answerId, voteType);
      // Update the local vote count using the updated value from the backend
      setAnswers((prev) =>
        prev.map((a) =>
          a.answer_id === answerId
            ? { ...a, vote_count: response.vote_count }
            : a
        )
      );
      // Update local tracking of user's vote
      setUserVotes((prev) => ({ ...prev, [answerId]: voteType }));
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Failed to vote.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        Loading...
      </div>
    );
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (!question)
    return <div className={styles.noQuestion}>Question not found.</div>;

  return (
    <div className={styles.questionPage}>
      <div className={styles.questionBox}>
        <h2>Question</h2>
        <p className={styles.title}>{question.title}</p>
        <p className={styles.description}>{question.description}</p>
        <div className={styles.meta}>
          <span className={styles.user}>
            by: <strong>{question.username || "Anonymous"}</strong>
          </span>
          <div className={styles.metaRight}>
            <span className={styles.timestamp}>
              {question.created_at &&
                new Date(question.created_at).toLocaleString()}
            </span>
            {/* Vote section for question can be added here if desired */}
          </div>
        </div>
      </div>

      <div className={styles.answersSection}>
        <h3>Answers From The Community ({answers.length})</h3>
        {currentAnswers.length > 0 ? (
          currentAnswers.map((a) => (
            <div key={a.answer_id} className={styles.answerItem}>
              <div className={styles.userIcon}>
                <User size={24} />
              </div>
              <div className={styles.answerContent}>
                <div className={styles.answerMeta}>
                  <strong>{a.username || "Anonymous"}</strong>
                  <div className={styles.metaRight}>
                    <span className={styles.timestamp}>
                      {a.created_at && new Date(a.created_at).toLocaleString()}
                    </span>
                    <div className={styles.voteSection}>
                      <span className={styles.voteCount}>{a.vote_count}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleVote(a.answer_id, 1);
                        }}
                        className={
                          userVotes[a.answer_id] === 1
                            ? `${styles.voteButton} ${styles.voted}`
                            : styles.voteButton
                        }
                        disabled={loading}
                        aria-label={`Like answer by ${a.username}`}
                      >
                        <ThumbsUp size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleVote(a.answer_id, -1);
                        }}
                        className={
                          userVotes[a.answer_id] === -1
                            ? `${styles.voteButton} ${styles.voted}`
                            : styles.voteButton
                        }
                        disabled={loading}
                        aria-label={`Dislike answer by ${a.username}`}
                      >
                        <ThumbsDown size={20} />
                      </button>
                    </div>
                  </div>
                </div>
                {editingAnswerId === a.answer_id ? (
                  <form
                    onSubmit={(e) => handleEditSubmit(e, a.answer_id)}
                    className={styles.editForm}
                  >
                    <textarea
                      maxLength={500}
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                      required
                      disabled={loading}
                      aria-label="Edit your answer"
                    />
                    <div className={styles.editFooter}>
                      <span>{editedAnswer.length}/500</span>
                      <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p>{a.answer || "No answer content available."}</p>
                )}
                {a.user_id === user?.user_id && (
                  <span className={styles.ownActions}>
                    {editingAnswerId === a.answer_id ? (
                      <button
                        onClick={handleCancelEdit}
                        aria-label="Cancel editing answer"
                      >
                        Cancel
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(a)}
                          aria-label={`Edit answer by ${a.username}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(a.answer_id)}
                          aria-label={`Delete answer by ${a.username}`}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noAnswer}>No answers yet. Be the first!</p>
        )}
        {/* Pagination Controls */}
        {answers.length > answersPerPage && (
          <div className={styles.pagination}>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {user && (
        <div className={styles.answerFormBox}>
          <h3>Answer The Top Question</h3>
          <form onSubmit={handleAnswerSubmit} className={styles.answerForm}>
            <textarea
              maxLength={500}
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Write your answer here..."
              required
              disabled={loading}
              aria-label="Write your answer"
            />
            <div className={styles.answerFooter}>
              <span>{newAnswer.length}/500</span>
              <button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Your Answer"}
              </button>
            </div>
          </form>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Question;