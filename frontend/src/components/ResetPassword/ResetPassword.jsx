import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../../components/services/authServices";
import { Eye, EyeOff } from "react-feather";
import PasswordRequirements from "../utils/PasswordRequirements";
import styles from "./ResetPassword.module.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverMsg, setServerMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password requirements (same as in PasswordRequirements)
  const requirements = [
    {
      label: "At least 8 characters",
      test: (pw) => pw.length >= 8,
    },
    {
      label: "At least one uppercase letter",
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: "At least one lowercase letter",
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      label: "At least one number",
      test: (pw) => /\d/.test(pw),
    },
    {
      label: "At least one special character (@$!%*?&)",
      test: (pw) => /[@$!%*?&]/.test(pw),
    },
  ];

  // Check if all password requirements are met
  const isPasswordValid = () => {
    return requirements.every((req) => req.test(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setServerMsg("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Check if all password requirements are met
    if (!isPasswordValid()) {
      setError("Password does not meet all requirements.");
      setLoading(false);
      return;
    }

    try {
      const data = await resetPassword(token, newPassword);
      setServerMsg(
        data.msg || "Password reset successful. You can now log in."
      );
      setTimeout(() => {
        navigate("/", {
          state: { successMessage: "Password reset successful!" },
        });
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.msg || "Failed to reset password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPasswordContainer}>
      <div className={styles.content}>
        <h2 className={styles.title}>Reset Your Password</h2>
        <p className={styles.subtitle}>
          Enter your new password below to reset your account password.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {serverMsg && <p className={styles.success}>{serverMsg}</p>}
          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                disabled={loading}
                aria-label="New password"
              />
              <button
                type="button"
                className={styles.showPasswordIcon}
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {newPassword && <PasswordRequirements password={newPassword} />}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                disabled={loading}
                aria-label="Confirm new password"
              />
              <button
                type="button"
                className={styles.showPasswordIcon}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <p className={styles.backToLogin}>
            Remembered your password?{" "}
            <Link to="/" className={styles.loginLink}>
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
