import { useEffect, useState } from "react";
import api from "../services/api";
import "./home.css";
import "./deals.css";
import { Link } from "react-router-dom";
import HeroSlider from "../Components/HeroSlider";

const Home = ({ search = "", category = "", setCategory }) => {
  const [products, setProducts] = useState([]);
 
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 20, minutes: 45, seconds: 12 });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, bannerRes] = await Promise.all([
          api.get("/products"),
          api.get("/banners")
        ]);
        setProducts(prodRes.data);
        setBanners(bannerRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to get banner by slot
  const getBanner = (type, slot) => banners.find(b => b.type === type && b.slot === slot);

  // Simple countdown timer logic
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.title?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? product.category?.toLowerCase() === category.toLowerCase() : true;
    return matchSearch && matchCategory;
  });

  if (loading) return <h3 className="text-center mt-5">Loading products...</h3>;

  const heroBanner = getBanner('hero', 0);
  const promo1 = getBanner('promo-grid', 1);
  const promo2 = getBanner('promo-grid', 2);
  const promo3 = getBanner('promo-grid', 3);
  console.log(promo3);

  return (
    <div className="home-page-new">
      <div className="home-content">
        {/* Top Hero Section */}
        <div className="hero-section">
          <div className="main-banner">
            <div className="banner-text">
              <p className="wishlist-link">Trending Now »</p>
              <div className="offer-revealed">
                <p className="subtitle">{heroBanner ? heroBanner.subtitle : "Exclusive Festival Offer"}</p>
                <h1>{heroBanner ? heroBanner.title : <>THE ULTIMATE <br /> FASHION DESTINATION</>}</h1>
                <Link to="/deals" className="shop-now-btn">Shop Now</Link>
              </div>
            </div>
            <img src={heroBanner ? heroBanner.image : "/assets/images/hero_banner_new.png"} alt="Hero Banner" />
          </div>

          <div className="side-sections">
            <div className="recently-viewed" onClick={() => setCategory("Fashion")} style={{ cursor: 'pointer' }}>
              <div className="side-header">
                <h3>Recently Viewed</h3>
              </div>
              <div className="side-content">
                <img src="/assets/images/hero_banner_new.png" alt="Recent" />
                <p>Track your style history</p>
              </div>
            </div>

            <div className="suggestions" onClick={() => setCategory("Electronics")} style={{ cursor: 'pointer' }}>
              <div className="side-header">
                <h3>Style for You</h3>
              </div>
              <div className="side-content">
                <img src="/assets/images/promo_electronics.png" alt="Suggestion" />
                <p>Explore your vibe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="category-slider-section">
            <div className="section-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '30px' }}>
                <h2>Shop by Categories</h2>
                {category && (
                    <button 
                        onClick={() => setCategory("")}
                        style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                    >
                        Show All Products
                    </button>
                )}
            </div>
            <HeroSlider setCategory={setCategory} />
        </div>

        {/* Promo Grid below Categories */}
        <div className="promo-grid">
          {/* Promo Slot 1 - Electronics */}
          <div className="promo-item" onClick={() => setCategory("Electronics")} style={{ cursor: 'pointer' }}>
            <div className="promo-content">
              <p>TECH & GADGETS <br /> UP TO 40% OFF</p>
              <span className="promo-subtitle">Upgrade your lifestyle</span>
            </div>
            <img src={promo1 ? promo1.image : "/assets/images/promo_electronics.png"} alt="Promo 1" />
          </div>

          {/* Promo Slot 2 - Home */}
          <div className="promo-item" onClick={() => setCategory("Furniture")} style={{ cursor: 'pointer' }}>
            <div className="promo-content">
              <p>HOME DECOR <br /> STYLISH & COZY</p>
              <span className="promo-subtitle">Transform your space</span>
            </div>
            <img src={promo2 ? promo2.image : "/assets/images/promo_home.png"} alt="Promo 2" />
          </div>

          {/* Promo Slot 3 - Watch/Flash */}
          <div className="promo-item" onClick={() => setCategory("Watches")} style={{ cursor: 'pointer' }}>
            <div className="promo-content">
              <p>FLASH SELL <br /> ENDING SOON</p>
              <span className="promo-subtitle">Don't miss out!</span>
            </div>
            <img src={promo3 ? promo3.image : "/assets/images/watch_promo.png"} alt="Promo 3" />
          </div>
        </div>

        {/* Deals of the Day */}
        <div className="deals-of-the-day">
          <div className="deals-header">
            <div className="deals-title">
              <h2>{category ? `${category} Collection` : "Deals of the Day"}</h2>
              <div className="timer">
                <span className="left-text">Ends In</span>
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
            <Link to="/deals" className="view-all-btn">View All Deals</Link>
          </div>

          <div className="deals-grid-container">
            {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 12).map((product) => (
                    <Link to={`/product/${product._id}`} key={product._id} className="deal-item-card">
                      <div className="deal-image">
                        <img src={product.image || product.thumbnail} alt={product.title} />
                      </div>
                      <div className="deal-details">
                        <h3 className="deal-name">{product.title}</h3>
                        <div className="deal-pricing">
                          <span className="current-price">₹{product.price}</span>
                          <span className="old-price">₹{Math.round(product.price * 1.5)}</span>
                          <span className="discount-badge">30% OFF</span>
                        </div>
                        <p className="deal-tag">Limited Time Offer</p>
                      </div>
                    </Link>
                ))
            ) : (
                <div style={{ gridColumn: 'span 6', textAlign: 'center', padding: '40px' }}>
                    <h3>No products found in this category.</h3>
                    <button onClick={() => setCategory("")} className="view-all-btn" style={{ marginTop: '20px', border: 'none', cursor: 'pointer' }}>View All Products</button>
                </div>
            )}
          </div>
        </div>

        {/* Service Highlights */}
        <div className="service-highlights">
            <div className="service-item">
                <span className="service-icon">🚚</span>
                <h3>Free Shipping</h3>
                <p>On all orders above ₹999</p>
            </div>
            <div className="service-item">
                <span className="service-icon">🔄</span>
                <h3>Easy Returns</h3>
                <p>30-day hassle-free returns</p>
            </div>
            <div className="service-item">
                <span className="service-icon">💳</span>
                <h3>Secure Payment</h3>
                <p>100% secure payment gateway</p>
            </div>
            <div className="service-item">
                <span className="service-icon">🎧</span>
                <h3>24/7 Support</h3>
                <p>Dedicated customer service</p>
            </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
            <div className="newsletter-content">
                {subscribed ? (
                    <div className="success-message">
                        <h2>🎉 Thank You for Joining!</h2>
                        <p>We've added your email to our style community. High-five! 🖐️</p>
                    </div>
                ) : (
                    <>
                        <h2 className="h2">Join Our Style Community</h2>
                        <p className="pera">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                            <input 
                                type="email" 
                                placeholder="Enter your email address" 
                                required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;