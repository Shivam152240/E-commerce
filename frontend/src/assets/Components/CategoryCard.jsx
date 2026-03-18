import React from "react";

const CategoryCard = ({ title, items }) => {
  return (
    <div className="category-card">
      <h3>{title}</h3>

      <div className="category-items">
        {items.map((item, i) => (
          <div key={i}>
            <img src={item.img} alt="" />
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <span className="see-more">See more</span>
    </div>
  );
};

export default CategoryCard;
