import React, { useState } from "react";
import Login from "../auth/Login";
import Signup from "../auth/Signup"; // Import the Signup component
import About from "../About/About";
import styles from "./Landing.module.css";

const Landing = () => {
  const [showSignup, setShowSignup] = useState(false); // State to toggle between Login and Signup

  // Functions to toggle between Login and Signup
  const handleShowSignup = () => setShowSignup(true);
  const handleShowLogin = () => setShowSignup(false);

  return (
    <div className={styles.landingContainer}>
      <div className={styles.content}>
        {/* Left Side: Toggle between Login and Signup */}
        <div className={styles.loginSection}>
          {showSignup ? (
            <Signup onShowLogin={handleShowLogin} />
          ) : (
            <Login onShowSignup={handleShowSignup} />
          )}
        </div>

        {/* Right Side: About Component */}
        <div className={styles.aboutSection}>
          <About />
        </div>
      </div>
    </div>
  );
};

export default Landing;
