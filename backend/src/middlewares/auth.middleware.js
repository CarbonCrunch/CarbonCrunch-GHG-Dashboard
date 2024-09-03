import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is allowed
    console.log("role", req.user)
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
    let token;

    console.log("verifyJWTHeaders", req.headers);
    // console.log("verifyJWTuser", req.user);

    // Normalize header lookup and log all headers for debugging
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      console.log("Authorization header is missing or incorrectly formatted");
    }

    console.log("verifyJWTtoken", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodedToken", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    console.log("verifyJWTuser", user);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token: User not found");
    }

    req.user = user;
    console.log("verifyJWT-req.user", req.user);
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      console.error("JWT Error:", error.message);
      throw new ApiError(401, "Invalid or expired access token");
    }
    if (error instanceof ApiError) {
      console.error("ApiError:", error.message);
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
