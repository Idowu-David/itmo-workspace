import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Desk from "./models/Desk";
import crypto from "crypto";

// dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedDesks = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("CONNECTED TO MONGODB");

  const existing = await Desk.countDocuments();
  if (existing > 0) {
    console.log("Desks already seeded, skipping");
    process.exit();
  }

  const generatePIN = () => {
    return crypto.randomInt(1000, 9999).toString(); // 4 digit PIN
  };

  const desks = Array.from({ length: 8 }, (_, i) => ({
    deskNumber: `DESK ${i + 1}`,
    status: "available",
    currentBooking: null,
    pin: generatePIN(),
  }));

  await Desk.insertMany(desks);
  console.log("8 desks seeded successfully");
  process.exit();
};

seedDesks().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
