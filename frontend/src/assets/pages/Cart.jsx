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
              <div className="cart-item-top">
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
                  <p className="item-seller">Size: M, Size: Regular</p>
                  
                  <div className="item-rating">
                    <span className="badge bg-success" style={{fontSize: '12px'}}>4.0 ★</span> <span className="text-muted" style={{fontSize: '13px'}}>(2,943)</span> <img hspace="4" src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" width="50" alt="assured" />
                  </div>

                  <div className="item-price-row">
                    <span className="discount-tag">↓77%</span>
                    <span className="old-price">₹{item.productId ? Math.round(item.productId.price * 1.77) : 0}</span>
                    <span className="current-price">₹{item.productId?.price}</span>
                  </div>
                  
                  <div className="delivery-info-new">
                    <p>Delivery by Mar 25, Wed</p>
                  </div>
                </div>
              </div>

              <div className="item-actions-footer">
                <button className="save-later">
                  <i className="fa-regular fa-square-plus" style={{marginRight: '6px'}}></i> Save for later
                </button>
                <div className="action-divider"></div>
                <button className="remove-item" onClick={() => removeFromCart(item._id)}>
                  <i className="fa-regular fa-trash-can" style={{marginRight: '6px'}}></i> Remove
                </button>
                <div className="action-divider"></div>
                <button className="buy-now" onClick={() => navigate("/checkout", {
                state: {
                  selectedItem: {
                    productId: item.productId,
                    quantity: 1
                  }
                }
              })}>
                  <i className="fa-solid fa-bolt" style={{marginRight: '6px'}}></i> Buy this now
                </button>
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