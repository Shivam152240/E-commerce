import React from 'react';
import { NavLink } from 'react-router-dom';
import './bottomNav.css';

const BottomNav = () => {
    return (
        <div className="bottom-nav">
            <NavLink to="/home" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <i className="fa-solid fa-house"></i>
                <span>Home</span>
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <i className="fa-solid fa-cart-shopping"></i>
                <span>Cart</span>
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <i className="fa-solid fa-receipt"></i>
                <span>Orders</span>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                <i className="fa-solid fa-user"></i>
                <span>Profile</span>
            </NavLink>
        </div>
    );
};

export default BottomNav;
