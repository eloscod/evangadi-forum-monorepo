import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { loginUser } from "../../components/services/authServices";
import { validateEmail } from "../../components/utils/validators";
import { Eye, EyeOff } from "react-feather";
import styles from "./Login.module.css";

const Login = ({ onShowSignup }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const successMessage = location.state?.successMessage || "";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.password.trim()) newErrors.password = "Password is required";
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

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      login(response.token);
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data) {
        setServerError(
          err.response.data.message || "An error occurred during login"
        );
      } else {
        setServerError("Failed to connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login to your account</h2>
      <p>
        Don’t have an account?{" "}
        <Link
          to={onShowSignup ? "#" : "/signup"}
          onClick={(e) => {
            if (onShowSignup) {
              e.preventDefault();
              onShowSignup();
            }
          }}
          className={styles.orangeLink}
        >
          Create a new account
        </Link>
      </p>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}

      <form className={styles.loginForm} onSubmit={handleSubmit}>
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
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowPassword(!showPassword);
                }
              }}
              tabIndex="0"
              className={styles.togglePassword}
              role="button"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.password && (
            <p className={styles.errorMessage}>{errors.password}</p>
          )}
        </div>

        <div className={styles.forgot}>
          <Link to="/forgot-password" className={styles.orangeLink}>
            Forgot password?
          </Link>
        </div>

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
