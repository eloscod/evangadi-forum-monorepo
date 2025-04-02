import classes from "./Footer.module.css";
import logo from "../../assets/logo.png"; // Ensure the logo exists
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        {/* Logo + Socials */}
        <div className={classes.column}>
          <img src={logo} alt="Evangadi Logo" className={classes.logo} />
          <div className={classes.socials}>
            {/* External links still use <a> */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook page"
            >
              <FaFacebookF className={classes.socialIcon} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram page"
            >
              <FaInstagram className={classes.socialIcon} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our YouTube channel"
            >
              <FaYoutube className={classes.socialIcon} />
            </a>
          </div>
        </div>

        {/* Useful Links */}
        <div className={classes.column}>
          <h4 className={classes.columnTitle}>Useful Links</h4>
          <nav aria-label="Footer Useful Links">
            <ul className={classes.linkList}>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/how-it-works">How It Works</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Contact Info */}
        <div className={classes.column}>
          <h4 className={classes.columnTitle}>Contact Info</h4>
          <ul className={classes.contactList}>
            <li>Evangadi Networks</li>
            <li>
              <a href="mailto:support@evangadi.com">support@evangadi.com</a>
            </li>
            <li>
              <a href="tel:+12023862702">+1-202-386-2702</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Notice */}
      <div className={classes.copyright}>
        <p>
          &copy; {new Date().getFullYear()} Evangadi Networks. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
