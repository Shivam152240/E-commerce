import { useState, useEffect } from 'react';
import './sidebar.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../../admin/context/AuthContext';

function Sidebar({setCategory}) {
  const [dynamicCategories, setDynamicCategories] = useState([]);
  const { user, logout } = useAuth();
  const Navigate=useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setDynamicCategories(res.data);
      } catch (err) {
        console.error("Error fetching sidebar categories:", err);
      }
    };
    fetchCats();
  }, []);

  return(
    <div className="sidebar">
      <div className="offcanvas offcanvas-start text-bg-white"
        tabIndex="-1"
        id="offcanvasDark"
        aria-labelledby="offcanvasDarkLabel">

        <div className="offcanvas-header">
          {!user ? (
            <h4 className="offcanvas-title" id="offcanvasDarkLabel"><i className="fa-solid fa-circle-user me-2"></i>Hello, sign in</h4>
          ):(
            <h4><i className="fa-solid fa-circle-user me-2"></i>Hello, {user?.username}</h4>
          )}
          
          <button type="button"
            className="btn-close btn-close-dark"
            data-bs-dismiss="offcanvas"
            aria-label="Close">
          </button>
        </div>

        <div className="offcanvas-body">
          <h6 className="heading" >Trending</h6>
          <p className="p" onClick={() =>setCategory("Bestsellers")}>Bestsellers</p>
          <p className="p" onClick={()=>setCategory("New Release")}>New Release</p>
          <p className="p" onClick={() => setCategory("Movers and Shakers")}>Movers and Shakers</p>
          <hr/>
          
          <h6 className="heading">Digital Content And Devices</h6>
          <p className="p" onClick={() => setCategory("Echo & Alexa")}>Echo & Alexa</p>
          <p className="p" onClick={() => setCategory("Fire TV")}>Fire TV</p>
          <p className="p" onClick={() => setCategory("Kindle E-Readers & Books")}>Kindle E-Readers & Books</p>
          <p className="p" onClick={() => setCategory("Audible Audiobooks")}>Audible Audiobooks</p>
          <hr/>

          <h6 className="heading">Shop By Department</h6>
          {dynamicCategories.length > 0 ? (
            dynamicCategories.map(cat => (
              <p key={cat._id} className="p" onClick={() => setCategory(cat.name)}>{cat.name}</p>
            ))
          ) : (
            <>
              <p className="p" onClick={() => setCategory("Mobiles, Computers")}>Mobiles, Computers</p>
              <p className="p" onClick={() => setCategory("TV, Appliances, Electronics")}>TV, Appliances, Electronics</p>
              <p className="p" onClick={() => setCategory("Men's Fashion")}>Men's Fashion</p>
              <p className="p" onClick={() => setCategory("Women's Fashion")}>Women's Fashion</p>
            </>
          )}
        <hr/>
          <h5 className="heading">Your Account</h5>
          <Link className='user d-block mb-2' to="/profile" style={{textDecoration:'none'}}>
            <i className="fa-solid fa-circle-user me-2"></i>My Profile
          </Link>
          <Link className='user d-block mb-2' to="/address" style={{textDecoration:'none'}}>
            <i className="fa-solid fa-location-dot me-2"></i>Saved Address
          </Link>
          <Link className='user d-block mb-2' to="/orders" style={{textDecoration:'none'}}>
            <i className="fa-solid fa-box me-2"></i>Your Orders
          </Link>
          
          {user?.isAdmin && (
            <Link className='user d-block text-primary fw-bold mb-2' to="/admin" style={{textDecoration: 'none'}}>
              <i className="fa-solid fa-lock me-2"></i>Admin Panel
            </Link>
          )}
          
          <hr/>
          {!user ? (
            <div className="text-center">
              <button className="btn1  w-75 mb-2" onClick={()=>Navigate("/login")}>Sign In</button><br/>
              <button className="btn2  w-75 border" onClick={()=>Navigate("/register")}>Create an account</button>
            </div>
          ) : (
            <div className="text-center">
              <button className='btn2  w-75 mb-2' onClick={() => {
                logout();
                Navigate("/login");
              }}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Sidebar
