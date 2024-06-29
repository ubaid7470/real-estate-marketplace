import express from "express";
import { test, updateUserProfile } from "../controllers/user.controller.js";
import { verifyUserToken } from "../utils/verifyUser.js";

const route = express.Router();

route.get("/test", test);
//After verifying user, the updateUserProfile function will be triggered!
route.post("/update/:id", verifyUserToken, updateUserProfile);

export default route;
