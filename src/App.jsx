import { useState, useEffect, useRef } from "react";
import { createContext } from "react";
import Home from "./pages/home/Home";
import ViewProduct from "./pages/ViewProduct/ViewProduct";
import Checkout from "./pages/checkout_sys/Checkout_sys";
import LoginSignUp from "./pages/login_signup/login_signup";
import Admin from "./pages/admin/Admin";
import Landing from "./pages/landing/Landing";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import Starfield from "./components/Starfield/Starfield";
import { useAuth } from "./context/AuthContext";
import { useColorMode } from "./src/components/ui/color-mode";
import { isLandingMidnight, useStoredTheme } from "./utils/theme";
import { Route, Routes, useLocation } from "react-router-dom";

export const CartContext = createContext();

function readCart() {
  try {
    const raw = sessionStorage.getItem("Cart");
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const { canCart } = useAuth();
  const { colorMode } = useColorMode();
  const storedTheme = useStoredTheme();
  const { pathname } = useLocation();
  const onLanding = pathname === "/";
  const [cartProducts, setCartProducts] = useState(readCart);
  const skipPersist = useRef(true);

  useEffect(() => {
    if (onLanding && isLandingMidnight(colorMode, storedTheme)) {
      document.documentElement.setAttribute("data-landing", "");
    } else {
      document.documentElement.removeAttribute("data-landing");
    }
  }, [onLanding, colorMode, storedTheme]);

  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    sessionStorage.setItem("Cart", JSON.stringify(cartProducts));
  }, [cartProducts]);

  function editCart(cartItem) {
    setCartProducts((prev) =>
      prev.map((c) => (c.cartId === cartItem.cartId ? { ...cartItem } : c)),
    );
  }

  function addCart(item) {
    if (!canCart) {
      return;
    }
    setCartProducts((i) => [item, ...i]);
  }

  function deleteCartItem(id) {
    const newCart = cartProducts.filter((c) => c.cartId !== id);
    setCartProducts(newCart);
  }

  function clearCart() {
    setCartProducts([]);
  }

  function getFreeCartId() {
    const takenId = cartProducts.map((item) => item.cartId);
    for (let i = 0; i < 500; i++) {
      if (!takenId.includes(i)) {
        return i;
      }
    }
    return Date.now();
  }

  function inCart(id, size = "") {
    return cartProducts.some(
      (item) => item.id === id && (item.size || "") === (size || ""),
    );
  }

  return (
    <>
      <Starfield />
      <CartContext.Provider
        value={{
          cartProducts,
          addCart,
          deleteCartItem,
          getFreeCartId,
          inCart,
          editCart,
          clearCart,
          replaceCart: setCartProducts,
        }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login_signup" element={<LoginSignUp />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/shop"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/ViewProduct/:productId"
            element={
              <RequireAuth>
                <ViewProduct />
              </RequireAuth>
            }
          />
          <Route
            path="/Checkout"
            element={
              <RequireAuth cartOnly>
                <Checkout />
              </RequireAuth>
            }
          />
        </Routes>
      </CartContext.Provider>
    </>
  );
}
