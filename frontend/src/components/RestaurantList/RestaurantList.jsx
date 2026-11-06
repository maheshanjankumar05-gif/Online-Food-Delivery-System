import React from "react";
import "./RestaurantList.css";

export const restaurantData = [
  {
    id: "bawarchi",
    name: "Bawarchi Biryani House",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80",
    rating: "4.8",
    reviews: "1.2k+",
    deliveryTime: "20-25 mins",
    cuisines: "Biryani, North Indian, Veg",
    location: "RTC X Roads, Hyderabad",
    offer: "Flat ₹50 OFF with QUICK50"
  },
  {
    id: "little_italy",
    name: "Little Italy & Pasta Bar",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80",
    rating: "4.7",
    reviews: "850+",
    deliveryTime: "25-30 mins",
    cuisines: "Pasta, Italian, Cheese Dishes",
    location: "Banjara Hills",
    offer: "20% OFF with FIRSTBITE"
  },
  {
    id: "green_bowl",
    name: "Green Bowl Salads & Healthy Co.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
    rating: "4.6",
    reviews: "620+",
    deliveryTime: "15-20 mins",
    cuisines: "Salads, Healthy Bowls, Vegan",
    location: "Hitec City",
    offer: "Free Delivery with FREEDEL"
  },
  {
    id: "kathi_junction",
    name: "Kathi Junction & Rolls",
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80",
    rating: "4.5",
    reviews: "940+",
    deliveryTime: "20-25 mins",
    cuisines: "Kathi Rolls, Parathas, Street Food",
    location: "Madhapur",
    offer: "Flat ₹75 OFF on ₹250+"
  },
  {
    id: "sweet_tooth",
    name: "Sweet Tooth Bakery & Cafe",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    rating: "4.9",
    reviews: "1.5k+",
    deliveryTime: "15-20 mins",
    cuisines: "Cakes, Ice Cream, Shakes",
    location: "Jubilee Hills",
    offer: "Trending Bakery"
  },
  {
    id: "sandwich_club",
    name: "The Gourmet Sandwich Club",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80",
    rating: "4.6",
    reviews: "780+",
    deliveryTime: "15-20 mins",
    cuisines: "Club Sandwiches, Paninis, Toast",
    location: "Gachibowli",
    offer: "Freshly Grilled"
  },
  {
    id: "wok_noodle",
    name: "The Wok & Noodle Co.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
    rating: "4.7",
    reviews: "1.1k+",
    deliveryTime: "20-25 mins",
    cuisines: "Noodles, Chinese, Asian Bowls",
    location: "Kondapur",
    offer: "Best-Selling Asian"
  }
];

const RestaurantList = ({ selectedRestaurant, setSelectedRestaurant }) => {
  return (
    <div className="restaurant-section" id="restaurants">
      <div className="restaurant-header">
        <div>
          <h2>Featured Popular Restaurants</h2>
          <p className="restaurant-subtitle">
            Order directly from top-rated restaurants near you with ultra-fast delivery
          </p>
        </div>
        {selectedRestaurant !== "All" && (
          <button
            className="clear-restaurant-filter"
            onClick={() => setSelectedRestaurant("All")}
          >
            Show All Restaurants
          </button>
        )}
      </div>

      <div className="restaurant-cards-container">
        <div
          onClick={() => setSelectedRestaurant("All")}
          className={`all-restaurants-card ${selectedRestaurant === "All" ? "active" : ""}`}
        >
          <div className="all-rest-icon">🍽️</div>
          <h4>All Restaurants</h4>
          <p>Browse full menu</p>
        </div>

        {restaurantData.map((rest) => {
          const isSelected = selectedRestaurant === rest.name;
          return (
            <div
              key={rest.id}
              onClick={() => setSelectedRestaurant(isSelected ? "All" : rest.name)}
              className={`restaurant-card ${isSelected ? "selected" : ""}`}
            >
              <div className="restaurant-image-wrapper">
                <img src={rest.image} alt={rest.name} className="restaurant-image" />
                <span className="restaurant-offer-badge">{rest.offer}</span>
              </div>
              <div className="restaurant-info">
                <div className="restaurant-name-row">
                  <h3 className="restaurant-name">{rest.name}</h3>
                  <span className="restaurant-rating-badge">⭐ {rest.rating}</span>
                </div>
                <p className="restaurant-cuisines">{rest.cuisines}</p>
                <div className="restaurant-meta-row">
                  <span className="meta-time">⏱️ {rest.deliveryTime}</span>
                  <span className="meta-location">📍 {rest.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantList;

