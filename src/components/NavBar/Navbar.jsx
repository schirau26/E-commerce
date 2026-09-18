import css from "./Navbar.module.css";
import { Icon } from "@chakra-ui/react";
import { LuCircleUser } from "react-icons/lu";
import SearchComponent from "../SearchBar/SearchComponent.jsx";
import CartComponent from "../CartButton/CartComponent.jsx";
import { Link, useLocation } from "react-router-dom";
import { loginPath, useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function Navbar() {
  const { canCart } = useAuth();
  const location = useLocation();
  const accountHref = loginPath(`${location.pathname}${location.search}`);

  return (
    <header
      className={css.bar}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
      }}
    >
      <div className={css.searchSlot}>
        <SearchComponent />
      </div>
      <Link to="/" className={css.brand}>
        <span className={css.wordmark}>XENON</span>
      </Link>
      <div className={css.actions}>
        <Link to="/shop" className={css.shopLink}>
          Shop
        </Link>
        <ThemeToggle />
        {canCart ? (
          <Link to="/Checkout" className={css.iconButton} aria-label="Cart">
            <CartComponent />
          </Link>
        ) : null}
        <Link
          to={accountHref}
          className={css.iconButton}
          aria-label="Login or sign up"
        >
          <Icon as={LuCircleUser} boxSize="22px" />
        </Link>
      </div>
    </header>
  );
}
