import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "./Header.module.css";
import logo from "../../assets/logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles["header-container"]}>
        <Link to={token ? "/home" : "/"} className={styles.logo}>
          <img src={logo} alt="Evangadi Logo" />
        </Link>

        <button
          className={styles["menu-toggle"]}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="navigation-menu"
        >
          ☰
        </button>

        <nav
          id="navigation-menu"
          className={`${styles.nav} ${menuOpen ? styles.open : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <Link to="/home" className={styles["nav-link"]}>
            Home
          </Link>
          <Link to="/how-it-works" className={styles["nav-link"]}>
            How it works
          </Link>
          {user ? (
            <>
              {/* Uncomment to display a welcome message */}
              {/* <span className={styles["welcome-message"]}>
                Welcome, {user.username || "User"}
              </span> */}
              <button className={styles["auth-button"]} onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className={styles["auth-button"]}>Sign In</button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
