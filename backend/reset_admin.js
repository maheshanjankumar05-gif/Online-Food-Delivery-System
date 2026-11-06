import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/food-delivery";

async function resetAdminPassword() {
  await mongoose.connect(mongoUrl);
  const hashedPassword = await bcrypt.hash("admin1234", 10);
  
  await mongoose.connection.collection("users").updateOne(
    { email: "maheshanjankumar05@gmail.com" },
    { $set: { password: hashedPassword, role: "admin" } },
    { upsert: true }
  );
  
  await mongoose.connection.collection("users").updateOne(
    { email: "admin@quickbite.com" },
    { $set: { password: hashedPassword, role: "admin", name: "QuickBite Admin" } },
    { upsert: true }
  );

  console.log("SUCCESS: Both maheshanjankumar05@gmail.com and admin@quickbite.com passwords set to 'admin1234' with role 'admin'!");
  process.exit(0);
}

resetAdminPassword().catch((err) => {
  console.error(err);
  process.exit(1);
});

