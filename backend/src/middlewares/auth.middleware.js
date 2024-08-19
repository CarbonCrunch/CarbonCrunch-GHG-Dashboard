import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";




export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is allowed
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action"
      );
    }

    next();
  };
};

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      console.error("JWT Error:", error);
      throw new ApiError(401, "Invalid or expired access token");
    }
    if (error instanceof ApiError) {
      console.error("ApiError:", error);
      throw error;
    }
    console.error("General Error:", error);
    throw new ApiError(401, error.message || "Unauthorized request");
  }
});


export const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
});