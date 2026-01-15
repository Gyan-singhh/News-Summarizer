import express from "express";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
   
    if (!username || !email || !password || !confirmPassword) {
      throw new ApiError(400, "Please provide all required fields");
    }
    if (password !== confirmPassword) {
      throw new ApiError(400, "Passwords do not match");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User already exists with this email");
    }
    const user = await User.create({ username, email, password });
    if (!user) {
      throw new ApiError(500, "Failed to create user");
    }

    const token = user.generateAccessToken();
    const cookieName = "accessToken";

    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE || 5) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    user.password = undefined;
    return res.status(201).cookie(cookieName, token, cookieOptions).json(
      new ApiResponse(
        201,
        {
          user,
          token,
        },
        "User Registered successfully"
      )
    );
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password");
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new ApiError(401, "Invalid email or password");
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

    const token = user.generateAccessToken();
    const cookieName = "accessToken";

    const cookieOptions = {
      expires: new Date(
        Date.now() + (process.env.JWT_COOKIE_EXPIRE || 5) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    user.password = undefined;
    return res.status(201).cookie(cookieName, token, cookieOptions).json(
      new ApiResponse(
        201,
        {
          user,
          token,
        },
        "User Registered successfully"
      )
    );
  })
);

router.get(
  "/logout",
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    res.clearCookie("accessToken", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  })
);

router.get(
  "/me",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    req.user.password = "";
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User fetched successfully"));
  })
);

export default router;
