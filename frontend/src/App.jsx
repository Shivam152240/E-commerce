
import Navbar from './assets/Components/Navbar.jsx'
import Sidebar from './assets/Components/Sidebar.jsx'
import Home from './assets/pages/Home.jsx'
import ProductDetails from './assets/pages/ProductDetails.jsx'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from 'react';
import Cart from './assets/pages/Cart.jsx';
import Register from './assets/pages/Register.jsx';
import Login  from './assets/pages/Login.jsx';
import Checkout from './assets/pages/Checkout.jsx';
import MyOrders from './assets/pages/MyOrder.jsx';
import Footer from './assets/Components/Footer.jsx';
import BottomNav from './assets/Components/BottomNav.jsx';
import Address from './assets/pages/AddressPage.jsx';
import Payment from './assets/pages/Payment.jsx';
/* ADMIN SIDE */
import AdminLayout from "./admin/AdminLayout";
import AdminRoute from "./admin/AdminRoute";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import AddProduct from "./admin/pages/AddProduct";
import Categories from "./admin/pages/Categories";
import Users from "./admin/pages/Users";
import Orders from "./admin/pages/Orders";
import EditProduct from "./admin/pages/Edit";
import Banners from "./admin/pages/Banners";
import Deals from "./assets/pages/Deals";
import Profile from "./assets/pages/Profile";

function AppContent({ search, setSearch, category, setCategory }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  return (
    <div className="app-container">
      <Navbar search={search} setSearch={setSearch} isHomePage={isHomePage} />
      <div className="app-layout">
        <Sidebar setCategory={setCategory} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home search={search} category={category} setCategory={setCategory} />} />
            <Route path="/home" element={<Home search={search} category={category} setCategory={setCategory} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/address" element={<Address />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/profile" element={<Profile />} />

            {/* 🔴 ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="categories" element={<Categories />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="banners" element={<Banners />} />
            </Route>
          </Routes>
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );

}

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  return (
    <BrowserRouter>
      <AppContent 
        search={search} 
        setSearch={setSearch} 
        category={category} 
        setCategory={setCategory} 
      />
    </BrowserRouter>
  );
}

export default App
