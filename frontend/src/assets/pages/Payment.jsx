import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./payment.css";

const Payment = () => {
const location = useLocation();
const navigate = useNavigate();

const token = localStorage.getItem("token");

const {
products = [],
totalPrice = 0,
selectedAddress = null,
} = location.state || {};

const [paymentMethod, setPaymentMethod] = useState("card");
const [loading, setLoading] = useState(false);

const deliveryFees = 40;
const platformFee = 7;
const discount = 1000;

const finalAmount = totalPrice + deliveryFees;

const mrp = totalPrice + discount;

// =========================
// CREATE ORDER IN DATABASE
// =========================
const createOrder = async (paymentData = {}) => {
try {
if (!selectedAddress) {
alert("Please select a delivery address");
return;
}

  const orderData = {
    products: products.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    })),

    totalAmount: finalAmount,

    paymentMethod:
      paymentMethod === "card"
        ? "CARD"
        : "COD",

    paymentStatus:
      paymentMethod === "card"
        ? "Paid"
        : "Pending",

    shippingAddress: {
      name: selectedAddress.name,
      mobile: selectedAddress.phone,
      address: selectedAddress.address,
      city: selectedAddress.city,
      pincode: selectedAddress.pincode,
    },

    // Razorpay payment details
    razorpayPaymentId:
      paymentData.razorpay_payment_id || null,

    razorpayOrderId:
      paymentData.razorpay_order_id || null,

    razorpaySignature:
      paymentData.razorpay_signature || null,
  };

  await api.post(
    "/orders",
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("Order placed successfully!");

  navigate("/orders");

} catch (error) {
  console.error("Order Creation Error:", error);

  alert(
    error.response?.data?.message ||
    "Order creation failed"
  );
}

};

// =========================
// RAZORPAY PAYMENT
// =========================
const handleRazorpayPayment = async () => {
try {
setLoading(true);


  // 1. Create Razorpay order from backend
  const response = await api.post(
    "/payment/create-order",
    {
      amount: finalAmount,
    }
  );

  const data = response.data;

  if (!data.success) {
    alert("Unable to create payment order");
    setLoading(false);
    return;
  }

  // 2. Razorpay Checkout Options
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,

    amount: data.order.amount,

    currency: data.order.currency,

    name: "VELASTÉ",

    description: "E-commerce Order Payment",

    order_id: data.order.id,

    handler: async function (paymentResponse) {
      try {
        console.log(
          "Payment Successful:",
          paymentResponse
        );

        // 3. Payment success ke baad database mein order create
        await createOrder(paymentResponse);

      } catch (error) {
        console.error(
          "Payment Success Order Error:",
          error
        );

        alert(
          "Payment successful, but order creation failed. Please contact support."
        );
      }
    },

    prefill: {
      name: selectedAddress?.name || "",
      contact: selectedAddress?.phone || "",
    },

    theme: {
      color: "#000000",
    },

    modal: {
      ondismiss: function () {
        setLoading(false);
      },
    },
  };

  // 4. Open Razorpay Checkout
  const razorpay = new window.Razorpay(options);

  razorpay.on(
    "payment.failed",
    function (response) {
      console.error(
        "Payment Failed:",
        response.error
      );

      alert(
        response.error.description ||
        "Payment failed"
      );

      setLoading(false);
    }
  );

  razorpay.open();

} catch (error) {
  console.error(
    "Razorpay Error:",
    error
  );

  alert(
    error.response?.data?.message ||
    "Payment failed"
  );

  setLoading(false);
}

};

// =========================
// MAIN PAYMENT HANDLER
// =========================
const handlePayment = async () => {
if (!selectedAddress) {
alert("Please select a delivery address");
return;
}


if (!products.length) {
  alert("Your cart is empty");
  return;
}

// COD
if (paymentMethod === "cod") {
  try {
    setLoading(true);

    await createOrder();

  } finally {
    setLoading(false);
  }

  return;
}

// ONLINE PAYMENT
await handleRazorpayPayment();


};

return ( <div className="payment-page">

  {/* ================= HEADER ================= */}

  <div className="payment-header">

    <div className="header-content">

      <div
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        <span className="arrow">←</span>
        Complete Payment
      </div>

      <div className="secure-badge">
        <span className="lock-icon">
          🔒
        </span>

        100% Secure
      </div>

    </div>

  </div>


  {/* ================= MAIN CONTAINER ================= */}

  <div className="payment-container">

    {/* ================= LEFT ================= */}

    <div className="payment-left">

      <div className="payment-options">

        {/* RAZORPAY / ONLINE PAYMENT */}

        <div
          className={`option-item ${
            paymentMethod === "card"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setPaymentMethod("card")
          }
        >

          <span className="icon">
            💳
          </span>

          <div className="text">

            <p className="title">
              Credit / Debit / UPI
            </p>

            <p className="sub">
              Secure payment powered by Razorpay
            </p>

            <p className="promo">
              Multiple payment options available
            </p>

          </div>

        </div>


        {/* COD */}

        <div
          className={`option-item ${
            paymentMethod === "cod"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setPaymentMethod("cod")
          }
        >

          <span className="icon">
            💵
          </span>

          <div className="text">

            <p className="title">
              Cash on Delivery
            </p>

          </div>

        </div>


        {/* DISABLED OPTIONS */}

        <div className="option-item disabled">

          <span className="icon">
            🎁
          </span>

          <div className="text">

            <p className="title">
              Gift Card
            </p>

          </div>

        </div>


        <div className="option-item disabled">

          <span className="icon">
            📱
          </span>

          <div className="text">

            <p className="title">
              UPI
            </p>

          </div>

          <span className="status">
            Unavailable ⓘ
          </span>

        </div>


        <div className="option-item disabled">

          <span className="icon">
            📅
          </span>

          <div className="text">

            <p className="title">
              EMI
            </p>

          </div>

          <span className="status">
            Unavailable ⓘ
          </span>

        </div>

      </div>


      {/* ================= PAYMENT DETAILS ================= */}

      <div className="payment-details">

        {paymentMethod === "card" ? (

          <div className="card-form">

            <p className="note">
              You will be redirected to Razorpay secure checkout.
            </p>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >

              {loading
                ? "Processing..."
                : `Pay ₹${finalAmount}`
              }

            </button>

          </div>

        ) : (

          <div className="cod-confirm">

            <p>
              Pay with cash upon delivery.
            </p>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >

              {loading
                ? "Placing Order..."
                : `Confirm Order ₹${finalAmount}`
              }

            </button>

          </div>

        )}

      </div>

    </div>


    {/* ================= RIGHT PRICE DETAILS ================= */}

    <div className="payment-right">

      <div className="price-details-card">

        <div className="price-row">

          <span>
            MRP (incl. of all taxes)
          </span>

          <span>
            ₹{mrp}
          </span>

        </div>


        <div className="price-row">

          <span>
            Fees
            <span className="arrow">
              ^
            </span>
          </span>

          <span></span>

        </div>


        <div className="price-row sub-row">

          <span className="label">
            Platform Fee
          </span>

          <span>
            ₹{platformFee}
          </span>

        </div>


        <div className="price-row">

          <span>
            Discounts
            <span className="arrow">
              ^
            </span>
          </span>

          <span></span>

        </div>


        <div className="price-row sub-row discount">

          <span className="label">
            MRP Discount
          </span>

          <span>
            -₹{discount}
          </span>

        </div>


        <div className="total-row">

          <span>
            Total Amount
          </span>

          <span>
            ₹{finalAmount}
          </span>

        </div>

      </div>


      <div className="promo-banner">

        <div className="banner-text">

          <p className="bold">
            10% instant discount
          </p>

          <p>
            Claim now with payment offers
          </p>

        </div>

        <div className="banner-icons">

          <span>
            💳
          </span>

          <span className="plus">
            +3
          </span>

        </div>

      </div>

    </div>

  </div>

</div>


);
};

export default Payment;
