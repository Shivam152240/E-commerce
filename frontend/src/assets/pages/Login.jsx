import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:5000/api/auth';

export default function Login() {

  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add login logic here
    try {
      const res = await axios.post(`${API}/login`, form);
      // ✅ Save login info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              onChange={handleChange}
              value={form.email}
              placeholder="Enter your email"
              required
              name="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              name="password"
            />
          </div>
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}><p className=' p text-end text-primary '>forgot password</p></Link>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}