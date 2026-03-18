import { Navigate } from "react-router-dom";
import { useAuth } from "../admin/context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // ⏳ jab tak auth load ho raha hai
  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  }


  // 🔒 not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🚫 not admin
  if (!user.isAdmin) {
    return <Navigate to="/home" />;
  }

  // ✅ admin allowed
  return children;
};

export default AdminRoute;

