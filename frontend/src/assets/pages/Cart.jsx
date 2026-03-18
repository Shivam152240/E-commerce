import React, { useEffect, useState } from "react";
import "./cart.css";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const Cart = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get("/products/cart");
      setCart(res.data);
    } catch (error) {
      console.log("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/products/cart/${cartItemId}`);
      setCart(cart.filter((item) => item._id !== cartItemId));
    } catch (error) {
      console.log("Remove cart error:", error);
    }
  };

  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await api.put(`/products/cart/${cartItemId}`, { quantity: newQty });
      setCart(cart.map(item => item._id === cartItemId ? { ...item, quantity: res.data.quantity } : item));
    } catch (error) {
      console.log("Update quantity error:", error);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.productId?.price * item.quantity), 0);
  };

  const totalMRP = calculateTotal();
  const discount = Math.round(totalMRP * 0.2); // 20% flat hypothetical discount for UI
  const deliveryCharge = totalMRP > 500 ? 0 : 40;
  const finalAmount = totalMRP - discount + deliveryCharge;

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Your cart is loading...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-card">
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" />
          <h3>Your cart is empty!</h3>
          <p>Add items to it now.</p>
          <button className="shop-now-btn" onClick={() => navigate("/home")}>Shop Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container-new">
      <div className="cart-left-section">
        <div className="cart-header-main">
          <h2>My Cart ({cart.length})</h2>
        </div>
        
        <div className="cart-items-list">
          {cart.map((item) => (
            <div className="cart-item-card-new" key={item._id}>
              <div className="item-image-section">
                <img src={item.productId?.image || item.productId?.thumbnail} alt={item.productId?.title} />
                <div className="quantity-controls-new">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <input type="text" value={item.quantity} readOnly />
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
              </div>
              
              <div className="item-details-section">
                <Link to={`/product/${item.productId?._id}`} className="item-title">{item.productId?.title}</Link>
                <p className="item-seller">Seller: QuickCart Official</p>
                <div className="item-price-row">
                  <span className="current-price">₹{item.productId?.price}</span>
                  <span className="old-price">₹{Math.round(item.productId?.price * 1.4)}</span>
                  <span className="discount-tag">28% Off</span>
                </div>
                <div className="item-actions-new">
                  <button className="save-later">SAVE FOR LATER</button>
                  <button className="remove-item" onClick={() => removeFromCart(item._id)}>REMOVE</button>
                </div>
              </div>
              
              <div className="delivery-info-new">
                <p>Delivery in 2 - 3 days | <span className="free">Free</span></p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="place-order-footer">
          <button className="place-order-btn" onClick={() => navigate("/checkout")}>PLACE ORDER</button>
        </div>
      </div>

      <div className="cart-right-section">
        <div className="price-details-card">
          <h3 className="card-title">PRICE DETAILS</h3>
          <hr />
          <div className="price-row">
            <span>Price ({cart.length} items)</span>
            <span>₹{totalMRP}</span>
          </div>
          <div className="price-row">
            <span>Discount</span>
            <span className="discount-text">- ₹{discount}</span>
          </div>
          <div className="price-row">
            <span>Delivery Charges</span>
            <span className="delivery-text">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
          </div>
          <hr className="dotted-hr" />
          <div className="total-amount-row">
            <span>Total Amount</span>
            <span>₹{finalAmount}</span>
          </div>
          <hr className="dotted-hr" />
          <p className="savings-text">You will save ₹{discount} on this order</p>
        </div>
        
        <div className="safe-payment-info">
          <i className="fa-solid fa-shield-halved"></i>
          <span>Safe and Secure Payments. 100% Authentic products.</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;