import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, selectedRestaurant = "All" }) => {
  const { food_list } = useContext(StoreContext);

  const filteredList = (food_list || []).filter((item) => {
    const matchesCategory =
      category === "All" ||
      (item.category || "").trim().toLowerCase() === category.trim().toLowerCase();

    const matchesRestaurant =
      selectedRestaurant === "All" ||
      (item.restaurant || "").trim().toLowerCase() === selectedRestaurant.trim().toLowerCase();

    return matchesCategory && matchesRestaurant;
  });

  return (
    <div className="food-display" id="food-display">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
        <h2>
          {selectedRestaurant !== "All"
            ? `Dishes from ${selectedRestaurant}`
            : category !== "All"
            ? `${category} Dishes`
            : "Top dishes near you"}
        </h2>
        <span style={{ fontSize: "14px", color: "#777" }}>
          Showing {filteredList.length} items
        </span>
      </div>

      {filteredList.length === 0 ? (
        <div style={{ padding: "40px 20px", textAlign: "center", background: "#fcfcfc", borderRadius: "8px", border: "1px dashed #ddd" }}>
          <p style={{ margin: "0 0 10px", color: "#676767", fontSize: "16px" }}>
            No dishes found for this selection.
          </p>
          <span style={{ fontSize: "13px", color: "#999" }}>
            Try selecting "All Dishes" or choose a different restaurant above.
          </span>
        </div>
      ) : (
        <div className="food-display-list">
          {filteredList.map((item, index) => {
            return (
              <FoodItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                restaurant={item.restaurant}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
