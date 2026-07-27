import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import "./productDetails.css";
import { getImageUrl } from "../utils/image";

const ProductDetails = () => {

const { id } = useParams();
const navigate = useNavigate();
const { addToCart } = useCart();

const [product,setProduct] = useState(null);
const [selectedImage,setSelectedImage] = useState("");
const [relatedProducts,setRelatedProducts] = useState([]);
const [size,setSize] = useState("M");
const [loading,setLoading] = useState(true);

useEffect(()=>{

const fetchProduct = async()=>{

try{

const res = await api.get(`/products/${id}`);
setProduct(res.data);

setSelectedImage(
  getImageUrl(res.data.image || res.data.thumbnail)
);

const related = await api.get("/products");
setRelatedProducts(related.data.slice(0,4));

}

catch(err){
console.log(err);
}

finally{
setLoading(false);
}

};

fetchProduct();

},[id]);


if(loading){
return <h3 className="text-center mt-5">Loading...</h3>
}

if(!product){
return <h3 className="text-center mt-5">Product not found</h3>
}


const discountPrice = Math.round(product.price * 0.8);

const thumbnails = [
  product.image ? getImageUrl(product.image) : null,
  product.thumbnail ? getImageUrl(product.thumbnail) : null
].filter(Boolean);


const clothingCategories=[
"tshirt",
"shirt",
"clothing",
"jeans",
"men's fashion",
"women's fashion",
"fashion"
];

const showSize = clothingCategories.includes(
product.category?.toLowerCase()
);


const handleAddToCart = async()=>{

try{

const token = localStorage.getItem("token");

await api.post("/products/cart",
{
productId:product._id,
quantity:1
},
{
headers:{
Authorization:`Bearer ${token}`
}
});

addToCart(product);
navigate("/cart");

}

catch(err){
console.log(err);
}

};


  return (
    <div className="product-details-page">
      {/* Breadcrumbs */}
      <div className="breadcrumb-container">
        <ul className="breadcrumbs">
          <li>Home</li>
          <li>{product.category || "Products"}</li>
          <li>{product.title}</li>
        </ul>
      </div>

      <div className="product-details-content">
        {/* Left Column: Image Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrapper">
            <img src={selectedImage} alt={product.title} className="gallery-main-image" />
            <div className="floating-actions">
              <button className="icon-btn heart">❤️</button>
              <button className="icon-btn share">🔗</button>
            </div>
          </div>
          <div className="thumbnail-list">
            {thumbnails.map((img, index) => (
              <div 
                key={index} 
                className={`thumb-wrapper ${selectedImage === img ? "active" : ""}`}
                onMouseEnter={() => setSelectedImage(img)}
              >
                <img src={img} alt={`Thumbnail ${index}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="product-info-section">
          <div className="brand-header">
            <span className="brand-name">{product.brand || "COMBRAIDED"}</span>
            <span className="visit-store">Visit store</span>
          </div>
          <h1 className="product-display-title">{product.title}</h1>
          
          <div className="rating-row">
            <div className="rating-badge">
              {product.rating || 4} ★
            </div>
            <span className="total-ratings">32,909 ratings</span>
           
          </div>

          <div className="price-container">
            <span className="discount-price">₹{discountPrice}</span>
            <span className="mrp-price">₹{product.price}</span>
            <span className="discount-percent">77% off</span>
            <div className="price-info-icon">ⓘ</div>
          </div>

          <div className="color-selector">
            <p className="selector-title">Selected Color: <span>GREY</span></p>
            <div className="color-swatches">
              {thumbnails.map((img, index) => (
                <div key={index} className="swatch">
                  <img src={img} alt={`Color ${index}`} />
                </div>
              ))}
            </div>
          </div>

          {showSize && (
            <div className="size-selector">
              <div className="size-header">
                <p className="selector-title">Select Size</p>
                <span className="size-chart">Size Chart</span>
              </div>
              <div className="size-options">
                {["S", "M", "L", "XL", "XXL"].map((s) => (
                  <div 
                    key={s} 
                    className={`size-option ${size === s ? "active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to cart
            </button>
            <button 
              className="buy-now-btn" 
              onClick={() => navigate("/checkout", {
                state: {
                  selectedItem: {
                    productId: product,
                    quantity: 1
                  }
                }
              })}
            >
              Buy at ₹{discountPrice}
            </button>
          </div>

          <div className="description-section">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;