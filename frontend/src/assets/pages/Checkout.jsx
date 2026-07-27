import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "./checkout.css";
import { getImageUrl } from "../utils/image";

const Checkout = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const selectedItem = location.state?.selectedItem;
  

  // Decide products to show
  const products = selectedItem ? [selectedItem] : cart;

  const totalPrice = products.reduce((sum, item) => {
    return sum + Number(item.productId.price) * Number(item.quantity);
  }, 0);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get("/user/address", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddress(res.data[0]); // Default to first address
        }
      } catch (error) {
        console.log("Error fetching addresses", error);
      }
    };
    if (token) fetchAddresses();
  }, [token]);

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    try {
      await api.post(
        "/orders",
        {
          products: products.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
          })),
          totalAmount: totalPrice,
          paymentMethod: "COD",
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

      if (!selectedItem) {
        setCart([]);
      }

      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert("Order failed");
    }
  };

  const mrp = totalPrice + 1000; // Mock MRP for discount display
  const discount = 1000;
  const deliveryFees = 40;

  return (
    <div className="checkout-page">
      {/* Checkout Navbar/Header */}
      <div className="checkout-stepper-header">
        <div className="stepper-container">
          <div className="step-item completed">
            <span className="step-num">✓</span>
            <span className="step-text">Address</span>
          </div>
          <div className="step-line active"></div>
          <div className="step-item active">
            <span className="step-num">2</span>
            <span className="step-text">Order Summary</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <span className="step-num">3</span>
            <span className="step-text">Payment</span>
          </div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-left">
          {/* Delivery Address Section */}
          <div className="checkout-section delivery-section">
            <div className="section-header">
              <span className="deliver-to">Deliver to:</span>
              <button className="change-btn" onClick={() => navigate("/address")}>Change</button>
            </div>
            {selectedAddress ? (
              <div className="delivery-details">
                <div className="user-name-tag">
                  <span className="name">{selectedAddress.name}</span>
                  <span className="tag">HOME</span>
                </div>
                <p className="address-line">
                  {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                </p>
                <p className="phone">{selectedAddress.phone}</p>
              </div>
            ) : (
              <div className="no-address">
                <p>No address found. Please add one.</p>
                <button onClick={() => navigate("/address")}>Add Address</button>
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="checkout-section order-summary-section">
            <div className="hot-deal-banner">
              <span className="hot-deal-icon">🔥</span>
              <span className="hot-deal-text">Hot Deal</span>
            </div>
            
            {products.map((item, index) => (
              <div className="checkout-product-card" key={`${item._id}-${index}`}>
                <div className="product-img">
                  <img src={getImageUrl(item.productId.image) || "https://via.placeholder.com/100"} alt={item.productId.title} />
                  <div className="qty-selector">
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="product-info">
                  <h4 className="product-title">{item.productId.title}</h4>
                  <div className="rating-row">
                    <span className="stars">★★★☆☆</span>
                    <span className="count">(2,906)</span>
                  </div>
                  <div className="price-row">
                    <span className="discount">-77%</span>
                    <span className="mrp">₹{Number(item.productId.price) + 500}</span>
                    <span className="current-price">₹{item.productId.price}</span>
                  </div>
                  <p className="delivery-note">Delivery by Mar 23, Mon</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Details Sidebar */}
        <div className="checkout-right">
          <div className="price-details-card">
            <h4 className="card-title">PRICE DETAILS</h4>
            <div className="price-row">
              <span>MRP</span>
              <span>₹{mrp}</span>
            </div>
            <div className="price-row">
              <span>Fees <span className="info-icon">ⓘ</span></span>
              <span>₹{deliveryFees}</span>
            </div>
            <div className="price-row discount">
              <span>Discounts</span>
              <span>-₹{discount}</span>
            </div>
            <div className="total-row">
              <span>Total Amount</span>
              <span>₹{totalPrice + deliveryFees}</span>
            </div>
            <div className="savings-msg">
              <span className="percentage-icon">%</span>
              You'll save ₹{discount} on this order!
            </div>
          </div>

          <div className="sticky-footer">
            <div className="footer-left">
              <span className="total">₹{totalPrice + deliveryFees}</span>
              <span className="info-icon">ⓘ</span>
            </div>
            <button className="continue-btn" onClick={() => navigate("/payment", { state: { products, totalPrice, selectedAddress } })}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;