import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);

  //   const userId = localStorage.getItem("userId");
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  // ✅ Load orders USER-WISE on refresh
  useEffect(() => {
    if (!userId) {
      setOrders([]); // logout case
      return;
    }

    const savedOrders = localStorage.getItem(`orders_${userId}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      setOrders([]);
    }
  }, [userId]);

  // ✅ Save orders USER-WISE
  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `orders_${userId}`,
        JSON.stringify(orders)
      );
    }
  }, [orders, userId]);



  return (
    <OrderContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
