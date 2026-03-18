import { useState, useEffect } from "react";
import adminApi from "../services/adminApi";
import { useNavigate } from "react-router-dom";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await adminApi.get("/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "badge bg-warning";
      case "Shipped":
        return "badge bg-primary";
      case "Delivered":
        return "badge bg-success";
      case "Cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <h5>Loading Orders...</h5>
      </div>
    );

  return (
    <>
      <h3 className="mb-4 fw-bold">📦 Order Management</h3>

      <div className="card shadow border-0">

        <div className="card-body">

          <h5 className="mb-3">All Orders</h5>

          <table className="table table-hover align-middle">

            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>

              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No orders found
                  </td>
                </tr>
              ) : (

                orders.map((order, index) => (

                  <tr key={order._id}>

                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="fw-bold text-success">
                      ₹ {order.totalAmount}
                    </td>

                    <td>
                      <span className={getStatusBadge(order.orderStatus)}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td style={{ width: "180px" }}>
                      <select
                        className="form-select"
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
};

export default Orders;

