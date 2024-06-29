import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyUserToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "You are not authorize!"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden!"));

    req.user = user;

    next(); //it will move to update user profile (user.route.js)
  });
};
