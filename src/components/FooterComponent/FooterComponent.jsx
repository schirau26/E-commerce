import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaPinterestP } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import css from "./FooterComponent.module.css";

export default function FooterComponent() {
  return (
    <footer className={css.footer}>
      <div className={css.stars} aria-hidden="true" />
      <div className={css.glow} aria-hidden="true" />
      <div className={css.inner}>
        <div className={css.brand}>
          <p className={css.wordmark}>XENON</p>
          <p className={css.tagline}>
            Boutique pieces that catch the light after dusk.
          </p>
          <div className={css.social}>
            <a href="#" aria-label="Instagram" className={css.socialLink}>
              <FaInstagram />
            </a>
            <a href="#" aria-label="X" className={css.socialLink}>
              <FaXTwitter />
            </a>
            <a href="#" aria-label="Facebook" className={css.socialLink}>
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Pinterest" className={css.socialLink}>
              <FaPinterestP />
            </a>
          </div>
        </div>

        <nav className={css.columns} aria-label="Footer">
          <div className={css.column}>
            <h2 className={css.heading}>Shop</h2>
            <Link to="/">Home</Link>
            <Link to="/Checkout">Cart</Link>
            <Link to="/login_signup">Account</Link>
          </div>
          <div className={css.column}>
            <h2 className={css.heading}>Help</h2>
            <a href="#">Shipping</a>
            <a href="#">Returns</a>
            <a href="#">Contact</a>
          </div>
        </nav>

        <p className={css.copy}>© 2026 Xenon Boutique. All rights reserved.</p>
      </div>
    </footer>
  );
}
