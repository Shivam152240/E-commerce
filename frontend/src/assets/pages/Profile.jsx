import React, { useState } from 'react';
import { useAuth } from '../../admin/context/AuthContext';
import './profile.css';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || ''
    });
    const [loading, setLoading] = useState(false);

    if (!user) {
        return (
            <div className="profile-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Please login to view your profile.</p>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/user/profile', formData);
            updateUser(res.data);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || "Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-banner"></div>
                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-intro">
                            <h1>{user.username}</h1>
                            <p className="user-email">{user.email}</p>
                            <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                                {user.isAdmin ? 'Administrator' : 'Verified Customer'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-card stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">5</span>
                            <span className="stat-label">Total Orders</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">2</span>
                            <span className="stat-label">Addresses</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">12</span>
                            <span className="stat-label">Wishlist Items</span>
                        </div>
                    </div>

                    <div className="profile-grid">
                        <div className="profile-card info-card">
                            <h3><i className="fa-solid fa-user-gear me-2"></i>Account Details</h3>
                            
                            {isEditing ? (
                                <form onSubmit={handleUpdate} className="edit-profile-form">
                                    <div className="info-item mb-3">
                                        <label>Username</label>
                                        <input 
                                            type="text" 
                                            className="form-control mt-1"
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="info-item mb-4">
                                        <label>Email Address</label>
                                        <input 
                                            type="email" 
                                            className="form-control mt-1"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="edit-actions">
                                        <button type="submit" className="btn-edit-profile save" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button type="button" className="btn-edit-profile cancel mt-2" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="info-list">
                                        <div className="info-item">
                                            <label>Username</label>
                                            <span>{user.username}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Email Address</label>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Phone Number</label>
                                            <span>+91 98765 43210</span>
                                        </div>
                                        <div className="info-item">
                                            <label>Member Since</label>
                                            <span>March 2024</span>
                                        </div>
                                    </div>
                                    <button className="btn-edit-profile mt-4" onClick={() => setIsEditing(true)}>Update Account</button>
                                </>
                            )}
                        </div>

                        <div className="profile-card actions-card">
                            <h3><i className="fa-solid fa-shield-halved me-2"></i>Security & Settings</h3>
                            <div className="action-links">
                                <button className="action-link">
                                    <i className="fa-solid fa-key"></i> Change Password
                                </button>
                                <button className="action-link">
                                    <i className="fa-solid fa-bell"></i> Notifications
                                </button>
                                <button className="action-link">
                                    <i className="fa-solid fa-credit-card"></i> Payment Methods
                                </button>
                                <button className="action-link delete" onClick={handleLogout}>
                                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
