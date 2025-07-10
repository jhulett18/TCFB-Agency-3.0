import styles from "./Navbar.module.css";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "./menuOverrides.css";
import classNames from "classnames";
import logo from "../../assets/tcfb_logo.png";

export default function Navbar() {
  return (
    <header className={styles.navbarRoot}>
      <div className={styles.logoContainer}>
        <img
          src={logo}
          alt="FoodFinder logo"
          className={styles.logo}
        />
      </div>

      <nav className={styles.navActions} aria-label="Main navigation">
        {/* Slogan Text */}
        <div className={styles.slogan_text}>
          <span className={styles.slogan_text_primary_color}>
            Tackling Hunger.{" "}
          </span>
          <span className={styles.slogan_text_secondary_color}>
            Since 1988.
          </span>
        </div>

        {/* Help Button */}
        <button className={styles.helpButton} onClick={() => window.location.href = 'https://stophunger.org'}>Return to Main Site</button>
      </nav>
    </header>
  );
}
