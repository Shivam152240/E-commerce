import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import "./MyOrder.css";
import api from "../services/api";

const MyOrders = () => {

  const { orders, setOrders } = useOrder();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [reviewData, setReviewData] = useState({});

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {

      const res = await api.get("/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleRating = (productId, rating) => {

    setReviewData({
      ...reviewData,
      [productId]: {
        ...reviewData[productId],
        rating
      }
    });

  };

  const handleReviewChange = (productId, text) => {

    setReviewData({
      ...reviewData,
      [productId]: {
        ...reviewData[productId],
        review: text
      }
    });

  };

  const submitReview = async (productId) => {

    try {

      const data = reviewData[productId];

      if (!data?.rating || !data?.review) {
        alert("Please give rating and review");
        return;
      }

      await api.post("/products/review",
        {
          productId,
          rating: data.rating,
          review: data.review
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      alert("Review Submitted");

    } catch (error) {
      console.log(error);
    }

  };

  const cancelOrder = async (orderId) => {

    try {

      await api.put(`/orders/cancel/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchOrders();

    } catch (error) {
      console.log(error);
    }

  };

  const reorderProduct = async (productId) => {

    try {

      await api.post("/products/cart",
        {
          productId,
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      alert("Product added to cart");

    } catch (error) {
      console.log(error);
    }

  };

  const downloadInvoice = (order) => {

    const element = document.createElement("a");

    const file = new Blob(
      [
        `
Order Invoice
-----------------------
Order ID : ${order._id}
Total Amount : ₹ ${order.totalAmount}
Date : ${new Date(order.createdAt).toLocaleDateString()}
`
      ],
      { type: "text/plain" }
    );

    element.href = URL.createObjectURL(file);
    element.download = `invoice_${order._id}.txt`;
    document.body.appendChild(element);
    element.click();

  };

  return (

    <div className="orders-container">

      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (

        orders.map((order) => (

          <div key={order._id} className="order-card">

            {order.products?.map((item, index) => (

              <div key={index} className="product-row">

                <div className="product-image">
                  <img src={item.productId?.image} alt="" />
                </div>

                <div className="product-details">

                  <h4>{item.productId?.title}</h4>

                  <p>Qty : {item.quantity}</p>

                  <p className={`status ${order.orderStatus}`}>
                    {order.orderStatus}
                  </p>

                  {/* 3-dot Actions Menu */}
                  <div className="mobile-order-actions dropdown">
                    <button className="btn btn-link p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="fa-solid fa-ellipsis-vertical fs-5 text-muted"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button className="dropdown-item" onClick={() => navigate(`/product/${item.productId?._id}`)}>
                          View Product
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => reorderProduct(item.productId?._id)}>
                          Reorder
                        </button>
                      </li>
                      {order.orderStatus === "Pending" && (
                        <li>
                          <button className="dropdown-item text-danger" onClick={() => cancelOrder(order._id)}>
                            Cancel Order
                          </button>
                        </li>
                      )}
                      {order.orderStatus === "Delivered" && (
                        <li>
                          <button className="dropdown-item">Return Product</button>
                        </li>
                      )}
                      <li>
                        <button className="dropdown-item" onClick={() => downloadInvoice(order)}>
                          Download Invoice
                        </button>
                      </li>
                    </ul>
                  </div>


                  {/* Review */}

                  {order.orderStatus === "Delivered" && (

                    <div className="review-section">

                      <p>Rate this product</p>

                      {[1, 2, 3, 4, 5].map((star) => (

                        <span
                          key={star}
                          className={
                            reviewData[item.productId?._id]?.rating >= star
                              ? "star active"
                              : "star"
                          }
                          onClick={() =>
                            handleRating(item.productId?._id, star)
                          }
                        >
                          ★
                        </span>

                      ))}

                      <textarea
                        placeholder="Write your review"
                        onChange={(e) =>
                          handleReviewChange(
                            item.productId?._id,
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="submit-review"
                        onClick={() =>
                          submitReview(item.productId?._id)
                        }
                      >
                        Submit Review
                      </button>

                    </div>

                  )}

                </div>

              </div>

            ))}

            {/* Order Tracking */}
            <div className="tracking-timeline">

              <div className={`timeline-step ${order.orderStatus !== "Pending" ? "done" : ""}`}>
                <div className="circle"></div>
                <div className="timeline-content">
                  <h5>Order Placed</h5>
                  <p>Your order has been placed</p>
                </div>
              </div>

              <div className={`timeline-step ${order.orderStatus === "Shipped" || order.orderStatus === "Delivered" ? "done" : ""}`}>
                <div className="circle"></div>
                <div className="timeline-content">
                  <h5>Shipped</h5>
                  <p>Your order has been shipped</p>
                </div>
              </div>

              <div className={`timeline-step ${order.orderStatus === "Delivered" ? "done" : ""}`}>
                <div className="circle"></div>
                <div className="timeline-content">
                  <h5>Delivered</h5>
                  <p>Package delivered successfully</p>
                </div>
              </div>

            </div>

            <div className="order-footer">

              <p>Order ID : {order._id}</p>

              <h4>Total : ₹ {order.totalAmount}</h4>

            </div>

          </div>

        ))

      )}

    </div>

  );
};

export default MyOrders;