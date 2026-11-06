import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const {
    getTotalCartAmount,
    token,
    food_list,
    cartItems,
    url,
    discount,
    appliedPromo,
    setCartItems
  } = useContext(StoreContext);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 40;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    (food_list || []).forEach((item) => {
      if (item && cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: finalTotal,
      discount: discount,
      promoCode: appliedPromo?.code || "",
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment",
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
      if (response.data.success) {
        setCartItems({});
        if (response.data.session_url) {
          window.location.replace(response.data.session_url);
        } else {
          toast.success(response.data.message || "Order placed successfully!");
          navigate("/myorders");
        }
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (err) {
      toast.error("Error processing order");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login to proceed with your order");
      navigate("/cart");
    } else if (subtotal === 0) {
      toast.error("Your cart is empty. Please add items to order");
      navigate("/cart");
    }
  }, [token, subtotal, navigate]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Address</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            value={data.firstName}
            onChange={onChangeHandler}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            value={data.lastName}
            onChange={onChangeHandler}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          value={data.email}
          onChange={onChangeHandler}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          value={data.street}
          onChange={onChangeHandler}
          type="text"
          placeholder="House / Flat / Street name"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            value={data.city}
            onChange={onChangeHandler}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            value={data.state}
            onChange={onChangeHandler}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            value={data.zipcode}
            onChange={onChangeHandler}
            type="text"
            placeholder="Pincode"
          />
          <input
            required
            name="country"
            value={data.country}
            onChange={onChangeHandler}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          value={data.phone}
          onChange={onChangeHandler}
          type="tel"
          placeholder="10-digit mobile number"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Items Subtotal</p>
              <p>&#8377;{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>&#8377;{deliveryFee}</p>
            </div>
            {discount > 0 && (
              <>
                <hr />
                <div className="cart-total-details" style={{ color: "#2e7d32", fontWeight: "600" }}>
                  <p>Promo Discount ({appliedPromo?.code})</p>
                  <p>-&#8377;{discount}</p>
                </div>
              </>
            )}
            <hr />
            <div className="cart-total-details">
              <b>Grand Total</b>
              <b style={{ color: "tomato", fontSize: "18px" }}>&#8377;{finalTotal}</b>
            </div>
          </div>

          <div className="payment-methods" style={{ marginTop: "20px" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#333" }}>Choose Payment Method:</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "14px",
                color: "#444"
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  border: paymentMethod === "COD" ? "2px solid tomato" : "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: paymentMethod === "COD" ? "#fff5f3" : "#fafafa",
                  fontWeight: paymentMethod === "COD" ? "600" : "400"
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                💵 Cash on Delivery (Pay upon delivery)
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  border: paymentMethod === "ONLINE" ? "2px solid tomato" : "1px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: paymentMethod === "ONLINE" ? "#fff5f3" : "#fafafa",
                  fontWeight: paymentMethod === "ONLINE" ? "600" : "400"
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                💳 Online Payment (Credit/Debit Card, Netbanking)
              </label>
            </div>
          </div>

          <button type="submit" style={{ marginTop: "24px" }}>
            {paymentMethod === "COD" ? `CONFIRM & PLACE ORDER (₹${finalTotal})` : `PROCEED TO PAYMENT (₹${finalTotal})`}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
