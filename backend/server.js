import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app config
const app = express();
const port = process.env.PORT || 4000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static(uploadsDir));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Serve Admin Panel at /admin
const adminDistPath = path.join(__dirname, "../admin/dist");
if (fs.existsSync(adminDistPath)) {
  app.use("/admin", express.static(adminDistPath));
  app.get("/admin*", (req, res) => {
    res.sendFile(path.join(adminDistPath, "index.html"));
  });
}

// Serve Customer Frontend at /
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("QuickBite API is running. Build frontend and admin to serve UI.");
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started successfully on port ${port} (0.0.0.0:${port})`);
});
