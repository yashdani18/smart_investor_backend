import express from "express";
import cors from "cors";

import UsersRouter from "./routes/users.js";
import AuthRouter from "./routes/auth.js";
import TickerRouter from "./routes/ticker.js";
import ProfileRouter from "./routes/profile.js";
import DetailRouter from "./routes/detail.js";
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

// Connect to database
// connectDB();

// Initialize express web application
const app = express();

// Init middleware
app.use(express.json({ extended: false }));

app.use(cors());

// Root endpoint
app.get("/", (req, res) => {
  res.json({ msg: "Hello World" });
});

// Define routes
app.use("/api/users", UsersRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/ticker", TickerRouter);
app.use("/api/profile", ProfileRouter);
app.use("/api/detail", DetailRouter);

// Define port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  mongoose
    .connect(process.env.MONGODB, { dbName: process.env.DB_NAME })
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
  console.log(`Server started on port ${PORT}`);
});
