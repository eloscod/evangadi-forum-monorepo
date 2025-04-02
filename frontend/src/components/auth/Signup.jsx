import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../components/services/authServices";
import {
  validateEmail,
  validatePassword,
} from "../../components/utils/validators";
import { Eye, EyeOff } from "react-feather";
import PasswordRequirements from "../../components/utils/PasswordRequirements";
import styles from "./Signup.module.css";

const Signup = ({ onShowLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setServerError("");
    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (!validatePassword(formData.password))
      newErrors.password = "Password must meet the requirements below";
    if (!agreed)
      newErrors.agreement =
        "You must agree to the privacy policy and terms of service";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      await registerUser({
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      // Show a success message and switch to login view
      setSuccessMessage("✅ Registration successful. Please log in!");
      setTimeout(() => {
        onShowLogin();
      }, 1500);
    } catch (err) {
      if (err.response && err.response.data) {
        setServerError(
          err.response.data.message || "An error occurred during signup"
        );
      } else {
        setServerError("Failed to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>Join the network</h2>
      <p>
        Already have an account?{" "}
        <Link
          to={onShowLogin ? "#" : "/login"}
          onClick={onShowLogin}
          className={styles.orangeLink}
        >
          Sign in
        </Link>
      </p>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}

      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.username && (
            <p className={styles.errorMessage}>{errors.username}</p>
          )}
        </div>

        <div className={styles.nameRow}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.firstName && (
              <p className={styles.errorMessage}>{errors.firstName}</p>
            )}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.lastName && (
              <p className={styles.errorMessage}>{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.email && (
            <p className={styles.errorMessage}>{errors.email}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <span
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowPassword(!showPassword);
                }
              }}
              tabIndex="0"
              role="button"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password}</p>
          )}
          {passwordFocused && (
            <PasswordRequirements password={formData.password} />
          )}
        </div>

        {/* Agreement Checkbox */}
        <label className={styles.agreementLabel}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={loading}
            className={styles.agreementCheckbox}
          />
          <span>
            I agree to the{" "}
            <a href="#" className={styles.orangeLink}>
              privacy policy
            </a>{" "}
            and{" "}
            <a href="#" className={styles.orangeLink}>
              terms of service
            </a>
          </span>
        </label>
        {errors.agreement && (
          <p className={styles.errorMessage}>{errors.agreement}</p>
        )}

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Joining..." : "Agree and Join"}
        </button>

        <p className={styles.bottomText}>
          Already have an account?{" "}
          <Link onClick={onShowLogin} className={styles.orangeLink}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
