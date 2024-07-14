import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifyUserToken } from "../utils/verifyUser.js";

const route = express.Router();

route.post("/create", verifyUserToken, createListing);

export default route;
