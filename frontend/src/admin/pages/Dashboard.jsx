import { useState, useEffect } from "react";
import adminApi from "../services/adminApi";
import { Link } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

const Dashboard = () => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const statsRes = await adminApi.get("/dashboard/stats");
        setStats(statsRes.data);

        const ordersRes = await adminApi.get("/orders");
        setRecentOrders(ordersRes.data.slice(0,5));

        setError(null);

      } catch (error) {

        console.error("Dashboard error:", error);
        setError("Failed to load dashboard data");

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, []);

  if (loading) return <div className="text-center mt-5">Loading Dashboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Products", value: stats.totalProducts },
    { name: "Orders", value: stats.totalOrders }
  ];

  const COLORS = ["#6366f1", "#22c55e", "#f97316"];

  const monthlySales = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3200 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 5200 }
  ];

  return (
    <>

      <h3 className="mb-4 fw-bold">📊 Admin Dashboard</h3>

      {/* Stats Cards */}

      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <Link to="/admin/users" style={{ textDecoration: "none" }}>
            <div className="card text-white shadow border-0"
              style={{ background:"linear-gradient(135deg,#667eea,#764ba2)" }}>
              <div className="card-body text-center">
                <h6>Total Users</h6>
                <h2>{stats.totalUsers}</h2>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/admin/products" style={{ textDecoration: "none" }}>
            <div className="card text-white shadow border-0"
              style={{ background:"linear-gradient(135deg,#43e97b,#38f9d7)" }}>
              <div className="card-body text-center">
                <h6>Total Products</h6>
                <h2>{stats.totalProducts}</h2>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/admin/orders" style={{ textDecoration: "none" }}>
            <div className="card text-white shadow border-0"
              style={{ background:"linear-gradient(135deg,#ff9a9e,#fecfef)" }}>
              <div className="card-body text-center">
                <h6>Total Orders</h6>
                <h2>{stats.totalOrders}</h2>
              </div>
            </div>
          </Link>
        </div>

        <div className="col-md-3">
          <Link to="/admin/sale" style={{ textDecoration: "none" }}>
            <div className="card text-white shadow border-0"
              style={{ background:"linear-gradient(135deg,#f6d365,#fda085)" }}>
              <div className="card-body text-center">
                <h6>Total Sales</h6>
                <h2>₹ {stats.totalSales.toLocaleString()}</h2>
              </div>
            </div>
          </Link>
        </div>

      </div>


      {/* Charts */}

      <div className="row g-4 mb-4">

        {/* Bar Chart */}

        <div className="col-md-7">

          <div className="card shadow border-0 p-4">

            <h5 className="fw-bold mb-3">📊 Platform Activity</h5>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="value" radius={[10,10,0,0]}>

                  {chartData.map((entry,index)=>(
                    <Cell key={index} fill={COLORS[index]} />
                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Pie Chart */}

        <div className="col-md-5">

          <div className="card shadow border-0 p-4">

            <h5 className="fw-bold mb-3">📈 Data Distribution</h5>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >

                  {chartData.map((entry,index)=>(
                    <Cell key={index} fill={COLORS[index]} />
                  ))}

                </Pie>

                <Legend />
                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>



      {/* Monthly Sales */}

      <div className="card shadow border-0 p-4 mb-4">

        <h5 className="fw-bold mb-3">💰 Monthly Sales</h5>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={monthlySales}>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>



      {/* Recent Orders */}

      <div className="card shadow border-0 p-4">

        <h5 className="fw-bold mb-3">🧾 Recent Orders</h5>

        <table className="table table-hover">

          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {recentOrders.map(order => (

              <tr key={order._id}>

                <td>#{order._id.slice(-6)}</td>

                <td>₹ {order.totalAmount}</td>

                <td>{order.orderStatus}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </>
  );
};

export default Dashboard;
