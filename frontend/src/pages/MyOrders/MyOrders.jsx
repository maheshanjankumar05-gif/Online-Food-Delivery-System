import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  const getStageIndex = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered")) return 3;
    if (s.includes("out") || s.includes("delivery")) return 2;
    if (s.includes("processing") || s.includes("kitchen") || s.includes("prep")) return 1;
    return 0;
  };

  const getProgressPercentage = (stageIdx) => {
    if (stageIdx === 0) return "10%";
    if (stageIdx === 1) return "40%";
    if (stageIdx === 2) return "75%";
    return "100%";
  };

  return (
    <div className="my-orders">
      <div className="my-orders-header">
        <div>
          <h2>Order History & Live Delivery Tracker</h2>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "4px" }}>
            Track your meal delivery in real-time with driver bio and live status
          </p>
        </div>
        {token && (
          <button className="refresh-orders-btn" onClick={fetchOrders}>
            🔄 Refresh Status
          </button>
        )}
      </div>

      {!token ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h3>Please sign in to view your orders and track delivery</h3>
        </div>
      ) : loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading your orders...</p>
        </div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fafafa", borderRadius: "12px" }}>
          <h3 style={{ marginBottom: "12px" }}>No orders placed yet</h3>
          <p style={{ color: "#777", marginBottom: "20px" }}>Hungry? Explore our delicious menu and place your first order!</p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "tomato",
              color: "white",
              padding: "12px 28px",
              border: "none",
              borderRadius: "24px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="orders-container">
          {data.map((order, index) => {
            const stageIdx = getStageIndex(order.status);
            const driver = order.driver || {
              name: "Rajesh Kumar",
              phone: "+91 98490 12345",
              rating: "4.9",
              deliveries: "520+ orders",
              vehicle: "Hero Splendor (TS 09 EA 4821)",
              photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
              bio: "Top-rated QuickBite delivery partner. Sanitized & insulated hot bag guaranteed!"
            };

            const orderDate = new Date(order.date).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit"
            });

            return (
              <div key={order._id || index} className="order-card">
                <div className="order-card-header">
                  <div className="order-id-group">
                    <span className="order-id-badge">Order #{order._id ? order._id.slice(-6).toUpperCase() : index + 1}</span>
                    <span className="order-date">• {orderDate}</span>
                  </div>
                  <div className="delivery-eta-badge">
                    {stageIdx === 3 ? (
                      <>✅ Order Delivered</>
                    ) : (
                      <>⏱️ Estimated Delivery: {order.estimatedDelivery || "25-30 mins"}</>
                    )}
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="tracker-section">
                    <div className="tracker-steps">
                      <div className="tracker-progress-line">
                        <div
                          className="tracker-progress-bar"
                          style={{ width: getProgressPercentage(stageIdx) }}
                        ></div>
                      </div>

                      <div className="tracker-step-item">
                        <div className={`step-circle ${stageIdx >= 0 ? "completed" : ""}`}>
                          ✓
                        </div>
                        <span className={`step-label ${stageIdx === 0 ? "active" : ""}`}>
                          Order Confirmed
                        </span>
                      </div>

                      <div className="tracker-step-item">
                        <div className={`step-circle ${stageIdx > 1 ? "completed" : stageIdx === 1 ? "active" : ""}`}>
                          {stageIdx > 1 ? "✓" : "🍳"}
                        </div>
                        <span className={`step-label ${stageIdx === 1 ? "active" : ""}`}>
                          Food Preparing
                        </span>
                      </div>

                      <div className="tracker-step-item">
                        <div className={`step-circle ${stageIdx > 2 ? "completed" : stageIdx === 2 ? "active" : ""}`}>
                          {stageIdx > 2 ? "✓" : "🛵"}
                        </div>
                        <span className={`step-label ${stageIdx === 2 ? "active" : ""}`}>
                          Out for Delivery
                        </span>
                      </div>

                      <div className="tracker-step-item">
                        <div className={`step-circle ${stageIdx === 3 ? "completed" : ""}`}>
                          {stageIdx === 3 ? "✓" : "🏠"}
                        </div>
                        <span className={`step-label ${stageIdx === 3 ? "active" : ""}`}>
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="driver-bio-card">
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="driver-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                      }}
                    />
                    <div className="driver-info">
                      <div className="driver-name-row">
                        <h4 className="driver-name">{driver.name}</h4>
                        <span className="driver-rating">⭐ {driver.rating} ({driver.deliveries})</span>
                      </div>
                      <p className="driver-vehicle">🛵 Vehicle: <b>{driver.vehicle}</b></p>
                      <p className="driver-bio-text">"{driver.bio}"</p>
                    </div>
                    <div>
                      <a href={`tel:${driver.phone}`} className="driver-action-btn">
                        📞 Call Driver ({driver.phone})
                      </a>
                    </div>
                  </div>

                  <div className="order-details-grid">
                    <div>
                      <span style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>ITEMS ORDERED</span>
                      <p className="order-items-list">
                        {(order.items || []).map((item, idx) => (
                          <span key={idx}>
                            {item.name} × {item.quantity} (&#8377;{item.price * item.quantity})
                            {idx < order.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>DELIVER TO</span>
                      <p style={{ margin: 0, fontSize: "13px" }}>
                        {order.address?.street}, {order.address?.city}
                      </p>
                      <span style={{ fontSize: "12px", color: "#777" }}>
                        Payment: <b>{order.paymentMethod || "Cash on Delivery"}</b>
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>TOTAL AMOUNT</span>
                      <span className="order-cost-badge">&#8377;{order.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
