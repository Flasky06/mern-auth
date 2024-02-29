import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

// create listing
export const createListing = async (req, res) => {
  try {
    const {
      userId,
      title,
      city,
      area,
      locationDescription,
      price,
      deposit,
      bathrooms,
      bedrooms,
      houseDescription,
      downloadURLs,
    } = req.body;

    // Check if the createdBy user exists
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newListing = new Listing({
      userId,
      username: user.username,
      email: user.email,
      title,
      city,
      area,
      locationDescription,
      price,
      deposit,
      bathrooms,
      bedrooms,
      houseDescription,
      downloadURLs,
    });

    await newListing.save();

    res.status(201).json(newListing);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

// update listing
export const updateListing = async (req, res, next) => {
  // if (req.user.id !== req.params.id) {
  //   return next(errorHandler(401, "You can update only your account!"));
  // }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          city: req.body.city,
          area: req.body.area,
        },
      },
      { new: true } // return the updated document
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
// fetch listing by property
export const fetchListing = async (req, res, next) => {
  try {
    console.log("id", req.params.id);

    const listing = await Listing.findById(req.params.id);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// fetch all listed properties
export const fetchAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// fetch listings posted by agent id
export const fetchAgentsListings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Find all listings created by the user
    Listing.find({ userId })
      .then((listings) => {
        res.status(200).json(listings);
        console.log("Listings created by the user:", listings);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error finding listings:", error);
      });
  } catch (error) {}
};
