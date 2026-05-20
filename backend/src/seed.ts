import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
import Desk from './models/Desk'
import path from "path";


// dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedDesks = async () => {
  await mongoose.connect((process.env.MONGODB_URI) as string);
  console.log("CONNECTED TO MONGODB")

  const existing = await Desk.countDocuments();
  if (existing > 0) {
    console.log("Desks already seeded, skipping")
    process.exit();
  }

  const desks = Array.from({length: 8}, (_, i) => ({
    deskNumber: i + 1,
    status: 'available',
    currentBooking: null,
  }))

  await Desk.insertMany(desks);
  console.log('8 desks seeded successfully')
  process.exit();
};

seedDesks().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})