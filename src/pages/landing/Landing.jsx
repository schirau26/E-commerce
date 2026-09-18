import { Link } from "react-router-dom";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { loginPath, useAuth } from "../../context/AuthContext";
import css from "./Landing.module.css";

export default function Landing() {
  const { canBrowse } = useAuth();
  const shopHref = canBrowse ? "/shop" : loginPath("/shop");

  return (
    <div className={css.page}>
      <section className={css.hero}>
        <header className={css.header}>
          <Link to="/" className={css.brand}>
            XENON
          </Link>
          <div className={css.headerActions}>
            <ThemeToggle />
            <Link to="/login_signup" className={css.account}>
              Account
            </Link>
          </div>
        </header>
        <div className={css.content}>
          <p className={css.kicker}>Xenon Boutique</p>
          <h1 className={css.title}>XENON</h1>
          <p className={css.tagline}>
            Boutique pieces that catch the light after dusk.
          </p>
          <p className={css.copy}>
            A house of evening objects — watches, silk, scent, and quiet
            jewellery — chosen to gleam when the day is done.
          </p>
          <Link to={shopHref} className={css.cta}>
            Enter the shop
          </Link>
        </div>
      </section>
      <FooterComponent />
    </div>
  );
}
