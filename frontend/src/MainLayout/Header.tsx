import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./Header.module.scss";
import { LogoutButton } from "./LogoutButton";

interface Props {}

export const Header: React.FC<Props> = () => {
  const location = useLocation();

  // this refers to the checkbox element (#nav-toggle) that controls whether
  // the header menu dropdown is shown based on it's checked state
  const navToggle = useRef<HTMLInputElement>(null);

  // this effect will only run on url location change
  useEffect(() => {
    // check id navToggle (#nav-toggle) is checked
    if (navToggle.current?.checked) {
      // set the checked property to false to hide the header menu
      navToggle.current.checked = false;
    }
  }, [location]);

  return (
    <header className={styles.Header}>
      <h1 className={styles.Header__logo}>
        <Link to='/'>Auctioneer</Link>
      </h1>
      <input
        type='checkbox'
        className={styles["nav-toggle"]}
        id='nav-toggle'
        ref={navToggle}
      />
      <nav>
        <ul>
          <li>
            <Link to='/home' className={styles.link}>
              Home
            </Link>
          </li>
          <li>
            <Link to='/dashboard' className={styles.link}>
              Dashboard
            </Link>
          </li>
          <li>
            <LogoutButton className={styles.link} />
          </li>
        </ul>
      </nav>
      <label htmlFor='nav-toggle' className={styles["nav-toggle-label"]}>
        <span></span>
      </label>
    </header>
  );
};

export default Header;
