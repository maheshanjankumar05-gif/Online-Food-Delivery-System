import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/frontend_assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, restaurant }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${url}/images/${image}`
    : assets.food_1;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          src={imageUrl}
          alt={name}
          className="food-item-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = assets.food_1;
          }}
        />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add to cart"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCart(id)}
              src={assets.remove_icon_red}
              alt="Remove item"
            />
            <p>{cartItems[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt="Add item"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        {restaurant && (
          <span style={{ fontSize: "11px", color: "#e5412b", fontWeight: "600", display: "block", marginBottom: "4px" }}>
            📍 {restaurant}
          </span>
        )}
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">
          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "700" }}>&#8377;</span>{price}
        </p>
      </div>
    </div>
  );
};

export default FoodItem;
