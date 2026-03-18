import React, { useRef } from "react";
import "./hero.css";


const items = [
  { title: "Fashion", category: "Fashion", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b" },
  { title: "Shoes", category: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
  { title: "Watches", category: "Watches", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49" },
  { title: "Furniture", category: "Furniture", image: "https://images.unsplash.com/photo-1505693314120-0d443867891c" },
  { title: "Electronics", category: "Electronics", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },
  { title: "Mobiles", category: "Mobiles", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
  { title: "Headphones", category: "Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
  { title: "Bags", category: "Bags", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },
  { title: "Bags", category: "Bags", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },


];

const CarouselSection = ({ setCategory }) => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction * 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="carousel-wrapper">
      <button
        className="carousel-btn left"
        onClick={() => handleScroll(-1)}
      >
        &#10094;
      </button>

      <div className="carousel-track" ref={sliderRef}>
        {items.map((item, i) => (
          <div className="carousel-card" key={i} onClick={() => setCategory(item.category)}>
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      <button
        className="carousel-btn right"
        onClick={() => handleScroll(1)}
      >
        &#10095;
      </button>
    </div>
  );
};

export default CarouselSection;