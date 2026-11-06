import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_key");

const driversList = [
  {
    name: "Rajesh Kumar",
    phone: "+91 98490 12345",
    rating: "4.9",
    deliveries: "520+ orders",
    vehicle: "Hero Splendor (TS 09 EA 4821)",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    bio: "Top-rated QuickBite delivery specialist. Sanitized & insulated hot bag guaranteed!"
  },
  {
    name: "Amit Sharma",
    phone: "+91 98765 67890",
    rating: "4.8",
    deliveries: "410+ orders",
    vehicle: "Honda Activa (TS 07 BE 8923)",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    bio: "Fast, polite & highly reliable rider. Committed to on-time doorstep delivery."
  },
  {
    name: "Suresh Patel",
    phone: "+91 98234 54321",
    rating: "4.9",
    deliveries: "630+ orders",
    vehicle: "TVS Jupiter (TS 10 AB 3412)",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80",
    bio: "Knows every lane and shortcut. Delivers your food smoking hot with a warm smile!"
  }
];

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:4000";
  try {
    const selectedDriver = driversList[Math.floor(Math.random() * driversList.length)];
    const paymentMethod = req.body.paymentMethod || "Cash on Delivery";
    const isCod = paymentMethod === "COD" || paymentMethod === "Cash on Delivery";

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: paymentMethod,
      payment: isCod ? true : false,
      status: "Food Processing",
      estimatedDelivery: "25-30 mins",
      driver: selectedDriver,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    if (isCod) {
      return res.json({
        success: true,
        orderId: newOrder._id,
        redirect_url: "/myorders",
        message: "Order placed successfully with Cash on Delivery!"
      });
    }

    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("placeholder")) {
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Delivery Charges",
          },
          unit_amount: 40 * 100,
        },
        quantity: 1,
      });

      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });

      return res.json({ success: true, session_url: session.url });
    } else {
      await orderModel.findByIdAndUpdate(newOrder._id, { payment: true });
      return res.json({
        success: true,
        orderId: newOrder._id,
        redirect_url: "/myorders",
        message: "Order placed successfully!"
      });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ date: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const orders = await orderModel.find({}).sort({ date: -1 });
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status
const updateStatus = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not an admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
