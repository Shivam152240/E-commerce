import { useState, useEffect } from "react";
import api from "../services/api";
import "./deals.css";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/image";

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 24, seconds: 45 });
  const [filters, setFilters] = useState({
    category: "All",
    maxPrice: 50000,
    minDiscount: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchCategory = filters.category === "All" || p.category === filters.category;
    const matchPrice = p.price <= filters.maxPrice;
    return matchCategory && matchPrice;
  });

  if (loading) return <div className="deals-loading">Loading Best Deals...</div>;

  return (
    <div className="deals-page">
      <div className="deals-container">
        {/* Sidebar Filters */}
        <aside className="deals-sidebar">
          <div className="sidebar-header">
            <h5>Filters</h5>
            <span className="clear-all" onClick={() => setFilters({category: "All", maxPrice: 50000, minDiscount: 0})}>CLEAR ALL</span>
          </div>

          <div className="filter-group">
            <h6>CATEGORIES</h6>
            <div className="category-list">
              {categories.map(cat => (
                <label key={cat} className="category-item">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={filters.category === cat}
                    onChange={() => setFilters({...filters, category: cat})}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h6>PRICE RANGE</h6>
            <input 
              type="range" 
              className="form-range" 
              min="0" 
              max="100000" 
              step="1000"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
            />
            <div className="price-labels">
              <span>₹0</span>
              <span>₹{filters.maxPrice}+</span>
            </div>
          </div>

          <div className="filter-group">
            <h6>DISCOUNT</h6>
            {[30, 40, 50, 60, 70].map(d => (
              <label key={d} className="category-item">
                <input type="checkbox" />
                <span>{d}% or more</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="deals-content">
          <div className="deals-banner">
            <div className="banner-info">
              <h1>Deals of the Day</h1>
              <div className="deals-timer">
                <i className="fa-regular fa-clock"></i>
                <span>{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s Left</span>
              </div>
            </div>
            {/* Desktop sorting buttons */}
            <div className="d-none d-md-flex gap-2">
              <button className="view-all-deals active">Best Selling</button>
              <button className="view-all-deals">Lowest Price</button>
            </div>

            {/* Mobile sorting 3-dot menu */}
            <div className="d-md-none dropdown">
              <button className="btn btn-link text-dark p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fa-solid fa-ellipsis-vertical fs-4"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item active">Best Selling</button></li>
                <li><button className="dropdown-item">Lowest Price</button></li>
              </ul>
            </div>
          </div>

          <div className="deals-grid-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} className="deal-item-card">
                  <div className="deal-image">
                    <img src={getImageUrl(product.image || product.thumbnail)} alt={product.title} />
                  </div>
                  <div className="deal-details">
                    <h3 className="deal-name">{product.title}</h3>
                    <div className="deal-pricing">
                      <span className="current-price">₹{product.price}</span>
                      <span className="old-price">₹{Math.round(product.price * 1.4)}</span>
                      <span className="discount-badge">30% OFF</span>
                    </div>
                    <p className="deal-tag">Limited Time Offer</p>
                  </div>
                </Link>
              ))
            ) : (

              <div className="no-deals">No deals found matching your filters.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Deals;
