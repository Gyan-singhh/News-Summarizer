import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decoded?._id).select("-password");
  if (!user) {
    throw new ApiError(401, "User not found");
  }

  req.user = user;
  next();
});

export { isAuthenticated };
