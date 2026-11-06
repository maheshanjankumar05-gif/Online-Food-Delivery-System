import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
    appliedPromo,
    discount,
    applyPromoCode,
    removePromoCode,
    availablePromos,
    url
  } = useContext(StoreContext);

  const [inputCode, setInputCode] = useState("");
  const navigate = useNavigate();

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 40;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
      setInputCode("");
    }
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {(food_list || []).map((item, index) => {
          if (item && cartItems[item._id] > 0) {
            const itemTotal = item.price * cartItems[item._id];
            return (
              <div key={item._id || index}>
                <div className="cart-items-title cart-items-item">
                  <img
                    src={item.image ? (item.image.startsWith("http") ? item.image : `${url}/images/${item.image}`) : ""}
                    alt={item.name}
                  />
                  <div>
                    <p style={{ fontWeight: "600", margin: "0 0 4px" }}>{item.name}</p>
                    {item.restaurant && (
                      <span style={{ fontSize: "11px", color: "#e5412b" }}>📍 {item.restaurant}</span>
                    )}
                  </div>
                  <p>&#8377;{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>&#8377;{itemTotal}</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross">
                    ❌
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
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
                  <p>
                    🎉 Promo Discount ({appliedPromo?.code})
                    <span
                      onClick={removePromoCode}
                      style={{ color: "#d32f2f", fontSize: "12px", cursor: "pointer", marginLeft: "8px", textDecoration: "underline" }}
                    >
                      Remove
                    </span>
                  </p>
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
          <button
            onClick={() => {
              if (subtotal === 0) {
                alert("Your cart is empty!");
              } else {
                navigate("/order");
              }
            }}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Have a promo code? Enter it below:</p>
            <form onSubmit={handleApplyPromo} className="cart-promocode-input">
              <input
                type="text"
                placeholder="e.g. QUICK50"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              />
              <button type="submit">Apply</button>
            </form>

            {/* Clickable available promo codes */}
            <div style={{ marginTop: "18px" }}>
              <span style={{ fontSize: "12px", color: "#666", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                🏷️ AVAILABLE PROMO CODES (Click to apply):
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(availablePromos || []).map((promo) => (
                  <div
                    key={promo.code}
                    onClick={() => applyPromoCode(promo.code)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: appliedPromo?.code === promo.code ? "#e8f5e9" : "#fff8f6",
                      border: appliedPromo?.code === promo.code ? "1px solid #4caf50" : "1px dashed tomato",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      transition: "0.2s"
                    }}
                  >
                    <div>
                      <b style={{ color: "tomato", letterSpacing: "0.5px" }}>{promo.code}</b>
                      <span style={{ color: "#555", marginLeft: "8px" }}>• {promo.title} ({promo.desc})</span>
                    </div>
                    <span style={{ color: "#2e7d32", fontWeight: "700", fontSize: "11px" }}>
                      {appliedPromo?.code === promo.code ? "APPLIED ✓" : "APPLY"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
