import express from "express";
import {
  test,
  updateUserProfile,
  deleteUser,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyUserToken } from "../utils/verifyUser.js";

const route = express.Router();

route.get("/test", test);
//After verifying user, the updateUserProfile function will be triggered!
route.post("/update/:id", verifyUserToken, updateUserProfile);
route.delete("/delete/:id", verifyUserToken, deleteUser);
route.get("/listings/:id", verifyUserToken, getUserListings);

export default route;
