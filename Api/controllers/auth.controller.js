import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

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
