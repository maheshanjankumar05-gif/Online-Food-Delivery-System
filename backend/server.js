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

// Enable CORS for Vercel, localhost, and all external clients
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token", "Authorization"],
  })
);

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);

// Serve static images with cross-origin headers for Vercel frontends
app.use(
  "/images",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(uploadsDir)
);

app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Serve Admin Panel at /admin if built locally/unified
const adminDistPath = path.join(__dirname, "../admin/dist");
if (fs.existsSync(adminDistPath)) {
  app.use("/admin", express.static(adminDistPath));
  app.get("/admin*", (req, res) => {
    res.sendFile(path.join(adminDistPath, "index.html"));
  });
}

// Serve Customer Frontend at / if built locally/unified
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      status: "online",
      message: "QuickBite Backend API is live on Render!",
      timestamp: new Date().toISOString(),
    });
  });
}

app.listen(port, "0.0.0.0", () => {
  console.log(`Server started successfully on port ${port} (0.0.0.0:${port})`);
});
