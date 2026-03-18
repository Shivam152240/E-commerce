import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import axios from 'axios';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
       
    });


    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            alert('Registration successful! Please log in.');
            navigate('/login');

        } catch(error){
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Registration failed. Please try again.";
            alert(errorMsg);
            console.error('Registration failed', error.response?.data || error.message);
        }
       
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>Create Account</h1>
                <p className="subtitle">Join us today and start shopping</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    

                    <button type="submit" className="btn-register">
                        Register
                    </button>
                </form>

                <p className="login-link">
                    Existing User? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
}
