import React from "react";
import "./Orders.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Orders = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);

  const fetchAllOrder = async () => {
    try {
      const response = await axios.get(url + "/api/order/list", {
        headers: { token },
      });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/status",
        {
          orderId,
          status: event.target.value,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAllOrder();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchAllOrder();
  }, []);

  return (
    <div className="order add">
      <h3>Customer Orders Management</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p style={{ padding: "20px", color: "#666" }}>No orders placed yet.</p>
        ) : (
          orders.map((order, index) => (
            <div key={order._id || index} className="order-item">
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {(order.items || []).map((item, idx) => {
                    if (idx === order.items.length - 1) {
                      return item.name + " x " + item.quantity;
                    } else {
                      return item.name + " x " + item.quantity + ", ";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address?.firstName + " " + order.address?.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address?.street + ","}</p>
                  <p>
                    {order.address?.city +
                      ", " +
                      order.address?.state +
                      ", " +
                      order.address?.country +
                      " - " +
                      order.address?.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">📞 {order.address?.phone}</p>
                {order.driver && (
                  <p style={{ fontSize: "12px", color: "#2e7d32", marginTop: "6px" }}>
                    🛵 <b>Driver:</b> {order.driver.name} ({order.driver.vehicle})
                  </p>
                )}
              </div>
              <p>Items: {order.items?.length || 0}</p>
              <p style={{ fontWeight: "700", color: "tomato" }}>&#8377;{order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Food Processing">Food Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
