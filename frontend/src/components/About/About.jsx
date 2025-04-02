import { Link } from "react-router-dom";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h4 className={styles.subtitle}>About</h4>
      <h2 className={styles.title}>Evangadi Networks</h2>

      <p className={styles.paragraph}>
        No matter what stage of life you are in, whether you’re just starting
        elementary school or being promoted to CEO of a Fortune 500 company, you
        have much to offer to those who are trying to follow in your footsteps.
      </p>

      <p className={styles.paragraph}>
        Wheather you are willing to share your knowledge or you are just looking
        to meet mentors of your own, please start by joining the network here.
      </p>

      <Link to="/how-it-works">
        <button className={styles.button}>HOW IT WORKS</button>
      </Link>
    </div>
  );
};

export default About;
