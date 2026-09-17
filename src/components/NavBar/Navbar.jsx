import css from "./Navbar.module.css";
import { Icon } from "@chakra-ui/react";
import { LuCircleUser } from "react-icons/lu";
import MenuComponent from "../MenuComponent/MenuComponent.jsx";
import SearchComponent from "../SearchBar/SearchComponent.jsx";
import CartComponent from "../CartButton/CartComponent.jsx";
import { Link } from "react-router-dom";

export default function Navbar() {
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
        <Link to="/Checkout" className={css.iconButton} aria-label="Cart">
          <CartComponent />
        </Link>
        <MenuComponent />
        <Link
          to="/login_signup"
          className={css.iconButton}
          aria-label="Login or sign up"
        >
          <Icon as={LuCircleUser} boxSize="22px" />
        </Link>
      </div>
    </header>
  );
}
