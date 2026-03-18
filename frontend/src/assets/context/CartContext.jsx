import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token"); // login check

  // ✅ Load cart USER-WISE on refresh / login
  useEffect(() => {
    if (!token) {
      setCart([]); // logout → empty cart
      return;
    }

    const savedCart = localStorage.getItem(`cart_${token}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  }, [token]);

  // ✅ Save cart USER-WISE
  useEffect(() => {
    if (token) {
      localStorage.setItem(
        `cart_${token}`,
        JSON.stringify(cart)
      );
    }
  }, [cart, token]);

  // ➕ ADD TO CART
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.id === product.id);

      if (exist) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // ❌ REMOVE FROM CART
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
