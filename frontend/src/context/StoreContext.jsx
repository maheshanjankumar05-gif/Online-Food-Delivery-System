import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

export const availablePromos = [
  { code: "QUICK50", discount: 50, minOrder: 150, title: "Flat ₹50 OFF", desc: "Valid on orders above ₹150" },
  { code: "FIRSTBITE", discountPercent: 20, maxDiscount: 100, minOrder: 200, title: "20% OFF (Up to ₹100)", desc: "Valid on orders above ₹200" },
  { code: "FREEDEL", freeDelivery: true, discount: 40, minOrder: 100, title: "FREE Delivery (Save ₹40)", desc: "Valid on orders above ₹100" },
  { code: "WELCOME75", discount: 75, minOrder: 250, title: "Flat ₹75 OFF", desc: "Valid on orders above ₹250" },
];

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = window.location.origin;
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [discount, setDiscount] = useState(0);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("Item added to cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        toast.error("Network error");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max(0, (prev[itemId] || 0) - 1) }));
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("Item removed from cart");
        } else {
          toast.error("Something went wrong");
        }
      } catch (err) {
        toast.error("Network error");
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = (food_list || []).find((product) => product._id === item);
        if (itemInfo && typeof itemInfo.price === "number") {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const applyPromoCode = (code) => {
    const cleanCode = (code || "").trim().toUpperCase();
    const subtotal = getTotalCartAmount();
    const promo = availablePromos.find((p) => p.code === cleanCode);

    if (!promo) {
      toast.error("Invalid promo code! Try QUICK50 or FIRSTBITE");
      return false;
    }

    if (subtotal < promo.minOrder) {
      toast.error(`Minimum order amount of ₹${promo.minOrder} required for ${promo.code}`);
      return false;
    }

    let calculatedDiscount = 0;
    if (promo.freeDelivery) {
      calculatedDiscount = 40;
    } else if (promo.discountPercent) {
      calculatedDiscount = Math.min(promo.maxDiscount, Math.round((subtotal * promo.discountPercent) / 100));
    } else if (promo.discount) {
      calculatedDiscount = promo.discount;
    }

    setDiscount(calculatedDiscount);
    setAppliedPromo(promo);
    toast.success(`Promo code ${promo.code} applied! You saved ₹${calculatedDiscount}`);
    return true;
  };

  const removePromoCode = () => {
    setDiscount(0);
    setAppliedPromo(null);
    toast.info("Promo code removed");
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data.success) {
        setFoodList(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching food list:", err);
    }
  };

  const loadCardData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (err) {
      console.error("Error loading cart:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCardData(savedToken);
      }
    }
    loadData();

    const handleFocus = () => {
      fetchFoodList();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    fetchFoodList,
    appliedPromo,
    discount,
    applyPromoCode,
    removePromoCode,
    availablePromos,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
