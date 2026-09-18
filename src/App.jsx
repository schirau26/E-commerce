import { useState, useEffect, useRef } from "react";
import { createContext } from "react";
import Home from "./pages/home/Home";
import ViewProduct from "./pages/ViewProduct/ViewProduct";
import Checkout from "./pages/checkout_sys/Checkout_sys";
import LoginSignUp from "./pages/login_signup/login_signup";
import { Route, Routes } from "react-router-dom";

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
  const [cartProducts, setCartProducts] = useState(readCart);
  const skipPersist = useRef(true);

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
      <CartContext.Provider
        value={{
          cartProducts,
          addCart,
          deleteCartItem,
          getFreeCartId,
          inCart,
          editCart,
          clearCart,
        }}
      >
        <Routes>
          <Route path="/login_signup" element={<LoginSignUp />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/" element={<Home />} />
          <Route path="/ViewProduct/:productId" element={<ViewProduct />} />
        </Routes>
      </CartContext.Provider>
    </>
  );
}
