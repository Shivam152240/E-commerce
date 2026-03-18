import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { products, totalPrice, selectedAddress } = location.state || { products: [], totalPrice: 0, selectedAddress: null };

  const [paymentMethod, setPaymentMethod] = useState("card");

  const mrp = totalPrice + 1000;
  const discount = 1000;
  const deliveryFees = 40;

  const handlePayment = async () => {
    try {
      await api.post(
        "/orders",
        {
          products: products.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
          })),
          totalAmount: totalPrice + deliveryFees,
          paymentMethod: paymentMethod === "card" ? "Card" : "COD",
          shippingAddress: {
            name: selectedAddress.name,
            mobile: selectedAddress.phone,
            address: selectedAddress.address,
            city: selectedAddress.city,
            pincode: selectedAddress.pincode,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert("Order failed");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <div className="header-content">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <span className="arrow">←</span>
            Complete Payment
          </div>
          <div className="secure-badge">
             <span className="lock-icon">🔒</span> 100% Secure
          </div>
        </div>
      </div>

      <div className="payment-container">
        <div className="payment-left">
          <div className="payment-options">
            <div 
              className={`option-item ${paymentMethod === "card" ? "active" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              <span className="icon">💳</span>
              <div className="text">
                <p className="title">Credit / Debit / ATM Card</p>
                <p className="sub">Add and secure cards as per RBI guidelines</p>
                <p className="promo">Get upto 5% cashback • 2 offers available</p>
              </div>
            </div>

            <div 
              className={`option-item ${paymentMethod === "cod" ? "active" : ""}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="icon">💵</span>
              <div className="text">
                <p className="title">Cash on Delivery</p>
              </div>
            </div>

            <div className="option-item disabled">
              <span className="icon">🎁</span>
              <div className="text">
                <p className="title">Have a Flipkart Gift Card?</p>
              </div>
            </div>

            <div className="option-item disabled">
              <span className="icon">📱</span>
              <div className="text">
                <p className="title">UPI</p>
              </div>
              <span className="status">Unavailable ⓘ</span>
            </div>

            <div className="option-item disabled">
              <span className="icon">📅</span>
              <div className="text">
                <p className="title">EMI</p>
              </div>
              <span className="status">Unavailable ⓘ</span>
            </div>
          </div>

          <div className="payment-details">
            {paymentMethod === "card" ? (
              <div className="card-form">
                <p className="note">Note: Please ensure your card can be used for online transactions. <span>Learn More</span></p>
                
                <div className="input-field">
                  <label>Card Number</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
                </div>

                <div className="row">
                  <div className="input-field">
                    <label>Valid Thru</label>
                    <input type="text" placeholder="MM / YY" />
                  </div>
                  <div className="input-field">
                    <label>CVV</label>
                    <input type="password" placeholder="CVV" />
                  </div>
                </div>

                <button className="pay-btn" onClick={handlePayment}>Pay ₹{totalPrice + deliveryFees}</button>
              </div>
            ) : (
              <div className="cod-confirm">
                <p>Pay with cash upon delivery.</p>
                <button className="pay-btn" onClick={handlePayment}>Confirm Order (₹{totalPrice + deliveryFees})</button>
              </div>
            )}
          </div>
        </div>

        <div className="payment-right">
          <div className="price-details-card">
             <div className="price-row">
               <span>MRP (incl. of all taxes)</span>
               <span>₹{mrp}</span>
             </div>
             <div className="price-row">
               <span>Fees <span className="arrow">^</span></span>
                <span></span>
             </div>
             <div className="price-row sub-row">
               <span className="label">Platform Fee</span>
               <span>₹7</span>
             </div>
             <div className="price-row">
               <span>Discounts <span className="arrow">^</span></span>
               <span></span>
             </div>
             <div className="price-row sub-row discount">
               <span className="label">MRP Discount</span>
               <span>-₹{discount}</span>
             </div>
             <div className="total-row">
                <span>Total Amount</span>
                <span>₹{totalPrice + deliveryFees}</span>
             </div>
          </div>

          <div className="promo-banner">
             <div className="banner-text">
               <p className="bold">10% instant discount</p>
               <p>Claim now with payment offers</p>
             </div>
             <div className="banner-icons">
                <img src="https://via.placeholder.com/20" alt="icon" />
                <span className="plus">+3</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
