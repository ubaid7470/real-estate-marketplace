import express from "express";
import {
  signup,
  signin,
  google,
  signOutUser,
} from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", signup);
route.post("/signin", signin);
route.post("/google", google);
route.get("/signOut", signOutUser);

export default route;
