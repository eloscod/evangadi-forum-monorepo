import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../components/services/authServices";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true); // Set loading to true

    if (!email) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    try {
      const data = await forgotPassword(email); // Use the new service
      setMessage(data.msg || "Check your email for the reset link.");
      setEmail("");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg || "Something went wrong.");
      } else {
        setError("An error occurred. Try again later.");
      }
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.content}>
        <h2 className={styles.title}>Forgot Your Password?</h2>
        <p className={styles.subtitle}>
          Enter your email and we'll send you a password reset link.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={loading} // Disable input while loading
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.backToLogin}>
          Remember your password?{" "}
          <Link to="/" className={styles.loginLink}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
