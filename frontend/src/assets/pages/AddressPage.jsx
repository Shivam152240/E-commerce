import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./addresspage.css";

const AddressPage = () => {

  const token = localStorage.getItem("token");
  const User = JSON.parse(localStorage.getItem("user")) || {};

  const [addresses,setAddresses] = useState([]);
  const [showForm,setShowForm] = useState(false);
  const [editId,setEditId] = useState(null);

  const [form,setForm] = useState({
    name:"",
    phone:"",
    pincode:"",
    city:"",
    state:"",
    address:""
  });

  const handleChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

  const getAddresses = async()=>{

    try{

      const res = await api.get("/user/address",{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      setAddresses(res.data)

    }
    catch(error){
      console.log(error)
    }

  }

  useEffect(()=>{
    getAddresses()
  },[])

  const saveAddress = async()=>{

    if(!form.name || !form.phone || !form.pincode || !form.city || !form.state || !form.address){
      alert("Please fill all fields")
      return
    }

    try{

      if(editId){

        await api.put(`/user/address/${editId}`,form,{
          headers:{Authorization:`Bearer ${token}`}
        })

      }else{

        await api.post("/user/address",form,{
          headers:{Authorization:`Bearer ${token}`}
        })

      }

      setForm({
        name:"",
        phone:"",
        pincode:"",
        city:"",
        state:"",
        address:""
      })

      setShowForm(false)
      setEditId(null)

      getAddresses()

    }
    catch(error){
      console.log(error)
    }

  }

  const deleteAddress = async(id)=>{

    try{

      await api.delete(`/user/address/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      })

      setAddresses(addresses.filter(a=>a._id!==id))

    }
    catch(error){
      console.log(error)
    }

  }

  const editAddress=(address)=>{

    setForm(address)
    setEditId(address._id)
    setShowForm(true)

  }

  return (
    <div className="account-container">
      {/* Sidebar */}
      <div className="account-sidebar">
        <div className="user-profile-section">
          <div className="user-avatar">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a3.svg" alt="Avatar" />
          </div>
          <div className="user-info">
            <span className="hello-text">Hello,</span>
            <span className="user-name">{User.username || "Guest"}</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <div className="menu-item section-header">
            <span className="menu-icon">📦</span>
            <span className="menu-text">MY ORDERS</span>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <span className="menu-icon">👤</span>
              <span className="menu-text">ACCOUNT SETTINGS</span>
            </div>
            <div className="section-links">
              <p>Profile Information</p>
              <p className="active">Manage Addresses</p>
              <p>PAN Card Information</p>
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <span className="menu-icon">💳</span>
              <span className="menu-text">PAYMENTS</span>
            </div>
            <div className="section-links">
              <p>Gift Cards <span className="balance">₹0</span></p>
              <p>Saved Cards</p>
              <p>Saved UPI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="account-content">
        <div className="manage-addresses-header">
          <h2>Manage Addresses</h2>
        </div>

        {/* Add New Address Button */}
        {!showForm && (
          <div className="add-address-bar" onClick={() => setShowForm(true)}>
            <span className="plus-icon">+</span>
            <span className="add-text">ADD A NEW ADDRESS</span>
          </div>
        )}

        {/* Address Form */}
        {showForm && (
          <div className="address-form-container">
            <div className="form-header">
              <h3>{editId ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}</h3>
            </div>
            
            <div className="row">
              <div className="input-group">
                <input name="name" value={form.name} placeholder="Name" onChange={handleChange} />
              </div>
              <div className="input-group">
                <input name="phone" value={form.phone} placeholder="10-digit mobile number" onChange={handleChange} />
              </div>
            </div>

            <div className="row">
              <div className="input-group">
                <input name="pincode" value={form.pincode} placeholder="Pincode" onChange={handleChange} />
              </div>
              <div className="input-group">
                <input name="city" value={form.city} placeholder="Locality" onChange={handleChange} />
              </div>
            </div>

            <div className="input-group full-width">
              <textarea name="address" value={form.address} placeholder="Address (Area and Street)" onChange={handleChange} />
            </div>

            <div className="row">
              <div className="input-group">
                <input name="state" value={form.state} placeholder="City/District/Town" onChange={handleChange} />
              </div>
              <div className="input-group">
                <select name="state_select" className="state-select">
                   <option value="">--Select State--</option>
                   <option value="UP">Uttar Pradesh</option>
                   {/* More states could be added */}
                </select>
              </div>
            </div>

            <div className="address-type-section">
              <p>Address Type</p>
              <div className="radio-group">
                <label>
                  <input type="radio" name="type" value="home" defaultChecked />
                  <span>Home</span>
                </label>
                <label>
                  <input type="radio" name="type" value="work" />
                  <span>Work</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button className="save-btn" onClick={saveAddress}>SAVE</button>
              <button className="cancel-btn" onClick={() => { setShowForm(false); setEditId(null); }}>CANCEL</button>
            </div>
          </div>
        )}

        {/* Saved Addresses */}
        <div className="address-list">
          {addresses.map((a) => (
            <div key={a._id} className="address-card">
              <div className="card-menu">
                <div className="dots">⋮</div>
                <div className="menu-dropdown">
                  <p onClick={() => editAddress(a)}>Edit</p>
                  <p onClick={() => deleteAddress(a._id)}>Delete</p>
                </div>
              </div>
              
              <div className="tag-row">
                <span className="type-tag">HOME</span>
              </div>

              <div className="user-details">
                <span className="name">{a.name}</span>
                <span className="phone">{a.phone}</span>
              </div>

              <div className="address-body">
                <p>{a.address}, {a.city}, {a.state} - <span>{a.pincode}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressPage