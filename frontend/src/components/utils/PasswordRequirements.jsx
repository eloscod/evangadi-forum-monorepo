import React from "react";
import { Check, X } from "react-feather";
import styles from "./PasswordRequirements.module.css";

const PasswordRequirements = ({ password }) => {
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

  return (
    <div className={styles.requirementsContainer}>
      <p className={styles.requirementsTitle}>Password must contain:</p>
      <ul className={styles.requirementsList}>
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <li
              key={index}
              className={`${styles.requirementItem} ${
                isMet ? styles.met : styles.unmet
              }`}
            >
              {isMet ? (
                <Check size={14} className={styles.icon} />
              ) : (
                <X size={14} className={styles.icon} />
              )}
              <span>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
