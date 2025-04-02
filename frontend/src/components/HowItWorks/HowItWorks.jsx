import React from "react";
import {
  FaUserPlus,
  FaQuestionCircle,
  FaComments,
  FaUsers,
} from "react-icons/fa";
import styles from "./HowItWorks.module.css";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className={styles.howItWorksContainer}>
      <h1 className={styles.title}>How It Works</h1>
      <p className={styles.subtitle}>
        Learn how to get started and make the most of Evangadi Forum in just a
        few simple steps.
      </p>

      <div className={styles.steps}>
        {/* Step 1: Sign Up */}
        <div className={styles.step}>
          <div className={styles.iconWrapper}>
            <FaUserPlus className={styles.icon} />
          </div>
          <h3 className={styles.stepTitle}>1. Sign Up</h3>
          <p className={styles.stepDescription}>
            Create an account to join the Evangadi community. It’s quick and
            easy—just provide your email, username, and password.
          </p>
        </div>

        {/* Step 2: Ask Questions */}
        <div className={styles.step}>
          <div className={styles.iconWrapper}>
            <FaQuestionCircle className={styles.icon} />
          </div>
          <h3 className={styles.stepTitle}>2. Ask Questions</h3>
          <p className={styles.stepDescription}>
            Have a question? Post it to the forum and get answers from
            knowledgeable community members.
          </p>
        </div>

        {/* Step 3: Answer Questions */}
        <div className={styles.step}>
          <div className={styles.iconWrapper}>
            <FaComments className={styles.icon} />
          </div>
          <h3 className={styles.stepTitle}>3. Answer Questions</h3>
          <p className={styles.stepDescription}>
            Share your expertise by answering questions posted by others. Help
            the community grow by contributing your knowledge.
          </p>
        </div>

        {/* Step 4: Engage with the Community */}
        <div className={styles.step}>
          <div className={styles.iconWrapper}>
            <FaUsers className={styles.icon} />
          </div>
          <h3 className={styles.stepTitle}>4. Engage with the Community</h3>
          <p className={styles.stepDescription}>
            Vote on questions and answers, comment on discussions, and connect
            with like-minded individuals.
          </p>
        </div>
      </div>

      <div className={styles.cta}>
        <h3 className={styles.ctaTitle}>Ready to Get Started?</h3>
        <p className={styles.ctaDescription}>
          Join the Evangadi Forum today and start asking, answering, and
          connecting!
        </p>
        <Link to="/ask-question" className={styles.ctaButton}>
          Ask Your First Question
        </Link>
      </div>
    </div>
  );
};

export default HowItWorks;
