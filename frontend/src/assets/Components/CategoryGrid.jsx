import React from "react";
import CategoryCard from "./CategoryCard";
import "./category.css";

const data = [
  {
    title: "Revamp your home in style",
    items: [
      { img: "https://m.media-amazon.com/images/I/71Jqz8z6L-L._AC_UL320_.jpg", text: "Cushion covers" },
      { img: "https://m.media-amazon.com/images/I/71aG+xDKSYL._AC_UL320_.jpg", text: "Figurines" }
    ]
  },
  {
    title: "Appliances for your home",
    items: [
      { img: "https://m.media-amazon.com/images/I/61OZ6z6ZvlL._AC_UL320_.jpg", text: "AC" },
      { img: "https://m.media-amazon.com/images/I/71cQMXCLSvL._AC_UL320_.jpg", text: "Refrigerator" }
    ]
  },
  {
    title: "Starting ₹49 | Deals",
    items: [
      { img: "https://m.media-amazon.com/images/I/61G1r8p2DDL._AC_UL320_.jpg", text: "Cleaning" },
      { img: "https://m.media-amazon.com/images/I/61k2f3Fk6WL._AC_UL320_.jpg", text: "Bathroom" }
    ]
  },
  {
    title: "Bulk orders & GST savings",
    items: [
      { img: "https://m.media-amazon.com/images/I/61Dw5Z8LzJL._AC_UL320_.jpg", text: "Laptops" },
      { img: "https://m.media-amazon.com/images/I/61t0N7o0wXL._AC_UL320_.jpg", text: "Kitchen" }
    ]
  }
];

const CategoryGrid = () => {
  return (
    <div className="category-grid">
      {data.map((cat, i) => (
        <CategoryCard key={i} {...cat} />
      ))}
    </div>
  );
};

export default CategoryGrid;
