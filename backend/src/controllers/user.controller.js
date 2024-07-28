import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, companyName, facilityName, role } = req.body;

  // Check if all required fields are provided
  if (
    [username, password, companyName, facilityName, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check for existing user by username and facility name
  const existedUser = await User.findOne({
    username: username.toLowerCase(),
    facilityName: facilityName.toLowerCase(),
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "User with this username and facility name already exists"
    );
  }

  const user = await User.create({
    username: username.toLowerCase(),
    password,
    companyName,
    facilityName: facilityName.toLowerCase(),
    // personName,
    role,
  });
  // console.log(user);

  // Fetch created user without sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const accessToken = user.generateAccessToken();

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken },
        "User registered successfully. You can now log in."
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password, facilityName } = req.body;

  if (!username || !facilityName || !password) {
    throw new ApiError(400, "Username and facility name are required");
  }

  const user = await User.findOne({
    username: username.toLowerCase(),
    facilityName: facilityName.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(
      404,
      "User does not exist for this username and facility"
    );
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(loggedInUser);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

export const verifyToken = asyncHandler(async (req, res) => {
  // Get token from header
  const token = req.headers.authorization?.split(" ")[1]; // Try to get token from header or cookie

  if (!token) {
    return res
      .status(401)
      .json({ isValid: false, message: "No token provided" });
  }
  // console.log("token", token);
  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    // console.log("decoded", decoded);

    // Find user by id
    const user = await User.findById(decoded._id).select("-password");
    // console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ isValid: false, message: "User not found" });
    }
    // console.log("user",user);

    // Return response
    return res.json({
      isValid: true,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        companyName: user.companyName,
        facilityName: user.facilityName,
        // Add any other user fields you want to send to the frontend
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ isValid: false, message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ isValid: false, message: "Token expired" });
    }

    // For any other errors
    return res.status(500).json({
      isValid: false,
      message: "Server error during token verification",
    });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
};
