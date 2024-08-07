import express from "express";
import {
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyUserToken } from "../utils/verifyUser.js";

const route = express.Router();

route.post("/create", verifyUserToken, createListing);
route.post("/update", verifyUserToken, createListing);
route.delete("/delete", verifyUserToken, deleteListing);

export default route;
