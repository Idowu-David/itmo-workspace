import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import deskRoutes from "./routes/desk.routes";
import bookingRoutes from "./routes/booking.routes";
import { requestLogger } from "./middlewares/logger";
import { Server } from "socket.io";
import { createServer } from "node:http";

dotenv.config();

connectDB();

const app: Application = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.locals.io = io;
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

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

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
