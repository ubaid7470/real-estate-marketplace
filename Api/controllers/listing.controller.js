import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async () => {};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.userRef !== req.user.id) {
    return next(
      errorHandler(401, "You are not authorized to delete this Listing!")
    );
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing Deleted Successfully!");
  } catch (error) {
    next(error);
  }
};
