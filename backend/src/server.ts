import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import deskRoutes from "./routes/desk.routes";
import bookingRoutes from "./routes/booking.routes";
import { requestLogger } from "./middlewares/logger";

dotenv.config();

connectDB();

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000", // exact origin, not '*'
    credentials: true, // allow cookies/auth headers
  }),
);
app.use(express.json());

// Logger Middleware
app.use("/api", requestLogger);

// Authentication Routes
app.use("/api/auth", authRoutes);

// Desk routes
app.use("/api/desks", deskRoutes);

// Booking routes
app.use("/api/booking", bookingRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
