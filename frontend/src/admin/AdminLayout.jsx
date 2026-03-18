import { Link, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <div className="d-flex">

        {/* Sidebar */}
        <div
          style={{
            width: "240px",
            minHeight: "100vh",
            background: "#616d78ff",
            color: "white",
            padding: "20px",
            boxShadow: "2px 0 10px rgba(129, 125, 125, 0.2)"
          }}
        >
          <h4 style={{ textAlign: "center", marginBottom: "30px" }}>
            🛒 Admin Panel
          </h4>

          <Link className="sidebarLink" to="/admin">📊 Dashboard</Link>
          <Link className="sidebarLink" to="/admin/products">📦 Products</Link>
          <Link className="sidebarLink" to="/admin/categories">🗂 Categories</Link>
          <Link className="sidebarLink" to="/admin/users">👤 Users</Link>
          <Link className="sidebarLink" to="/admin/orders">🧾 Orders</Link>
          <Link className="sidebarLink" to="/admin/banners">🖼 Banners</Link>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            padding: "30px",
            background: "#f1f5f9",
            minHeight: "100vh"
          }}
        >
          <Outlet />
        </div>

      </div>

      {/* CSS Inside Component */}
      <style>
        {`
          .sidebarLink{
            display:block;
            color:white;
            text-decoration:none;
            margin-bottom:12px;
            padding:10px;
            border-radius:6px;
            transition:0.3s;
          }

          .sidebarLink:hover{
            background:#2c3e50;
            padding-left:16px;
            color:white;
          }

          @media (max-width: 991px) {
            .d-flex {
              flex-direction: column;
            }
            .d-flex > div:first-child {
              width: 100% !important;
              min-height: auto !important;
              padding: 10px !important;
              position: static !important;
            }
            .sidebarLink {
              display: inline-block;
              margin-right: 10px;
              margin-bottom: 5px;
              padding: 5px 10px;
            }
            .d-flex > div:last-child {
              padding: 15px !important;
              min-height: auto !important;
            }
          }
        `}
      </style>

    </>
  );
};

export default AdminLayout;
