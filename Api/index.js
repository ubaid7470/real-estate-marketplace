import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserRoutes from "./routes/user.routes.js";

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

app.listen(3000, () => {
  console.log("Server is running on port 3000!!!");
});

app.use("/api/user", UserRoutes);
