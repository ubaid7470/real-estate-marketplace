import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserRoute from "./routes/user.route.js";
import AuthRoute from "./routes/auth.route.js";
import ListingRoute from "./routes/listing.route.js";

import cookieParser from "cookie-parser";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});

app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/listing", ListingRoute);

//middle ware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } "${value}" already exists!`;
  }
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
