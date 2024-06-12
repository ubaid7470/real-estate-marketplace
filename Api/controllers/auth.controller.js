import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPass = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPass });

    await newUser.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User does not Exist"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return next(errorHandler(401, "Email or Password is Incorrect"));
    const authToken = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET_KEY
    );
    //httpOnly: true; restricts other third party apps to get our cookie
    const { password: pass, ...remaining_properties } = validUser._doc;
    res
      .cookie("access_token", authToken, { httpOnly: true })
      .status(200)
      .json(remaining_properties);
  } catch (error) {
    next(error);
  }
};
