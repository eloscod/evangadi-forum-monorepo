import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          Oops! It looks like the page you're looking for doesn't exist or has
          been moved.
        </p>
        <Link to="/" className={styles.homeButton}>
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
