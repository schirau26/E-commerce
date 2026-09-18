import { useState } from "react";
import { Link } from "react-router-dom";
import SignUp from "../../components/SignUp/SignUp";
import Login from "../../components/Login/Login";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import css from "./login_signup.module.css";

export default function loginSignUp() {
  const [isUser, setIsUser] = useState(true);

  return (
    <div className={css.page}>
      <div className={css.topBar}>
        <Link to="/" className={css.home}>
          Home
        </Link>
        <ThemeToggle />
      </div>

      <div className={css.layout}>
        <div className={css.form}>
          {isUser ? <Login user={setIsUser} /> : <SignUp user={setIsUser} />}
        </div>
        <div className={css.brand}>
          <p className={css.kicker}>Xenon Boutique</p>
          <h1 className={css.wordmark}>XENON</h1>
          <p className={css.tagline}>
            Boutique pieces that catch the light after dusk.
          </p>
        </div>
      </div>
    </div>
  );
}
