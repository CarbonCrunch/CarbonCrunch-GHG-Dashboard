import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import bcrypt from "bcrypt";
import { Facility } from "../models/facility.model.js";
import cloudinary from 'cloudinary';


// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dkiowo64c",
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY || "141629487434466",
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET || "duCohk5LZqFdbHt4lux5lE5IXSQ",
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    console.log("generateAccessAndRefreshTokens", accessToken, refreshToken);
    // user.refreshToken = refreshToken;
    // await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, companyName, facilityName, role, email } =
    req.body;
  console.log("Register", username, password, companyName, role, email);

  // Role-specific validation
  if (["Admin", "FacAdmin", "Employee"].includes(role)) {
    // Check if all required fields are provided for these roles
    if (
      [username, password, companyName, facilityName, role].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // Check for existing user by username and facility name
    const existedUser = await User.findOne({
      username: username,
      companyName: companyName,
    });

    if (existedUser) {
      throw new ApiError(
        409,
        "User with this username and companyName already exists"
      );
    }

    const user = await User.create({
      username: username,
      password,
      companyName,
      role,
    });

    // Fetch created user without sensitive information
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
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
  } else if (role === "SuperUser") {
    // Check if all required fields are provided for SuperUser role
    if (
      [username, password, email, role].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(
        400,
        "Username, Email, Password, and Role are required"
      );
    }

    // Check for existing user by username and email
    const existedUser = await User.findOne({
      username: username,
      email: email,
    });

    if (existedUser) {
      throw new ApiError(
        409,
        "User with this username and email already exists"
      );
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role,
    });

    // Fetch created user without sensitive information
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
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
  } else {
    throw new ApiError(400, "Invalid role provided");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password, facilityName, role, email } = req.body;
  console.log("login", username, password, facilityName, role, email);

  // Common validation for required fields
  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  let user; // Declare user variable once at the top

  if (["Admin", "FacAdmin", "Employee"].includes(role)) {
    // Role-specific validation for Admin, FacAdmin, Employee
    if (!facilityName) {
      throw new ApiError(400, "Facility name is required for this role");
    }

    // Find user by username and facility name for these roles
    const users = await User.aggregate([
      {
        $match: {
          username: username,
          role: role,
        },
      },
      {
        $lookup: {
          from: "facilities",
          localField: "facilities",
          foreignField: "_id",
          as: "facilities",
        },
      },
      {
        $addFields: {
          facilities: {
            $filter: {
              input: "$facilities",
              as: "facility",
              cond: { $eq: ["$$facility.facilityName", facilityName] },
            },
          },
        },
      },
      {
        $match: {
          "facilities.0": { $exists: true }, // Ensures at least one facility matches
        },
      },
    ]);

    // console.log("users", users);

    if (users.length === 0) {
      throw new ApiError(
        400,
        "User does not exist for this username, facility, and role"
      );
    }

    // Extract the user from the users array
    user = users[0];
  } else if (role === "SuperUser") {
    // Role-specific validation for SuperUser
    if (!email) {
      throw new ApiError(400, "Email is required for SuperUser role");
    }

    // Find user by username and email for SuperUser
    user = await User.findOne({
      username: username,
      email: email,
    });

    if (!user) {
      throw new ApiError(
        404,
        "User does not exist for this username, email, and role"
      );
    }
  } else {
    throw new ApiError(400, "Invalid role provided");
  }

  // console.log("user2", user);

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Fetch user without sensitive information
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  req.user = loggedInUser;
  console.log("req.user is set to:", req.user);

  const options = {
    httpOnly: true,
    secure: false, // Ensure this is true if you're using HTTPS
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // Set expiry to 1 day
  };

  // Set cookies
  res.cookie("accessToken", accessToken, options);
  res.cookie("refreshToken", refreshToken, options);

  // Debugging
  console.log("Set-Cookie headers:", res.getHeaders()["set-cookie"]);

  // Return response with tokens and user information
  return res.status(200).json(
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
  // console.log("token1", token) 
  if (!token) {
    return res
      .status(401)
      .json({ isValid: false, message: "No token provided" });
  }
  // console.log("token2", token);
  try {
    // Verify token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    // console.log("decoded", decoded);

    // Find user by id
    const user = await User.findById(decoded._id).select("-password");
    // console.log('user1',user);
    req.user = user;
    if (!user) {
      return res
        .status(404)
        .json({ isValid: false, message: "User not found" });
    }
    // console.log("user2",user);

    // Return response
    return res.json({
      isValid: true,
      user: user
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

export const logoutUser = asyncHandler(async (req, res) => {
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

export const refreshAccessToken = asyncHandler(async (req, res) => {
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

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export const getCompanyUsers = asyncHandler(async (req, res) => {
  const { companyName } = req.query; // Get company name from query parameters

  if (!companyName) {
    // If companyName is not provided, return a 400 error
    throw new ApiError(400, "Company name is required");
  }

  try {
    const users = await User.find({ companyName });
    // console.log("users", users);

    if (users.length === 0) {
      // If no users are found, return a 404 error
      throw new ApiError(404, "No users found for the provided company name");
    }

    // If users are found, return them in the response
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    // Handle any unexpected errors
    throw new ApiError(500, "An error occurred while fetching users", error);
  }
});

export const updateUserPermission = asyncHandler(async (req, res) => {
  const { username, facilityName, userId, permissions } = req.body; // Extract data from the request body
  console.log(
    "updateUserPermission",
    username,
    facilityName,
    userId,
    permissions
  );
  console.log("permission", permissions);

  // Validate the required fields
  if (!username || !facilityName || !userId || !permissions) {
    throw new ApiError(
      400,
      "Username, facilityName, userId, and permissions are required"
    );
  }

  try {
    // Find the facility by facilityName
    const facility = await Facility.findOne({ facilityName });

    if (!facility) {
      throw new ApiError(404, "Facility not found");
    }

    // Find the user role within the facility
    const userRole = facility.userRoles.find(
      (role) => role.username === username
    );

    if (!userRole) {
      throw new ApiError(404, "User role not found in the specified facility");
    }

    // Process each permission in the request body
    permissions.forEach(({ entity, actions, flag }) => {
      const permissionIndex = userRole.permissions.findIndex(
        (perm) => perm.entity === entity
      );

      if (flag === "update") {
        if (permissionIndex !== -1) {
          // If permission exists, update its actions based on "on" and "off"
          actions.forEach((action) => {
            if (action.status === "on") {
              // Ensure action is in the list
              if (
                !userRole.permissions[permissionIndex].actions.includes(
                  action.name
                )
              ) {
                userRole.permissions[permissionIndex].actions.push(action.name);
              }
            } else if (action.status === "off") {
              // Remove action if it exists in the list
              userRole.permissions[permissionIndex].actions =
                userRole.permissions[permissionIndex].actions.filter(
                  (a) => a !== action.name
                );
            }
          });
        } else {
          // If permission does not exist, create a new permission entry
          userRole.permissions.push({
            entity,
            actions: actions.map((action) => action.name),
          });
        }
      } else if (flag === "delete") {
        if (permissionIndex !== -1) {
          // If permission exists, remove it
          userRole.permissions.splice(permissionIndex, 1);
        }
      } else if (flag === "add") {
        if (permissionIndex !== -1) {
          // If the entity already exists, add missing actions to it
          actions.forEach((action) => {
            if (
              !userRole.permissions[permissionIndex].actions.includes(
                action.name
              )
            ) {
              userRole.permissions[permissionIndex].actions.push(action.name);
            }
          });
        } else {
          // If the entity does not exist, create a new entry with actions
          userRole.permissions.push({
            entity,
            actions: actions.map((action) => action.name),
          });
        }
      }
    });

    // Use findOneAndUpdate to directly save changes to the database
    await Facility.findOneAndUpdate(
      { facilityName },
      { $set: { userRoles: facility.userRoles } },
      { new: true }
    );

    // Respond with success
    return res
      .status(200)
      .json(
        new ApiResponse(200, facility, "User permissions updated successfully")
      );
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error updating user permissions:", error);
    throw new ApiError(
      500,
      "An error occurred while updating user permissions",
      error
    );
  }
});



export const deleteUserPermission = asyncHandler(async (req, res) => {
  const { username, userId, facilityName } = req.body; // Extract data from the request body
  console.log("deleteUserPermission", username, userId, facilityName);
  // Validate the required fields
  if (!username || !userId || !facilityName) {
    throw new ApiError(400, "Username, userId, and facilityName are required");
  }

  try {
    // Find the facility by facilityName
    const facility = await Facility.findOne({ facilityName });

    if (!facility) {
      throw new ApiError(404, "Facility not found");
    }

    // Find the index of the user role in the userRoles array by username
    const userRoleIndex = facility.userRoles.findIndex(
      (role) => role.username === username
    );

    if (userRoleIndex === -1) {
      throw new ApiError(404, "User role not found in the specified facility");
    }

    // Remove the entire user role object from the userRoles array
    facility.userRoles.splice(userRoleIndex, 1);

    // Save the updated facility document
    await facility.save();

    // Respond with success
    return res
      .status(200)
      .json(new ApiResponse(200, facility, "User role deleted successfully"));
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error deleting user role from facility:", error);
    throw new ApiError(
      500,
      "An error occurred while deleting user role",
      error
    );
  }
});

export const uploadLogo = asyncHandler(async (req, res) => {
  const file = req.files.file; // Access the uploaded file from the request
 const userId = req.body.userId; // Assume that user is authenticated and user ID is available on req.user
  // console.log("user", userId)
  // Check if file exists
  if (!file) {
    throw new ApiError(400, "No file uploaded");
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(
      file.tempFilePath,
      {
        folder: "company_logos", // Specify the folder where logos should be uploaded
      }
    );

    // Check if Cloudinary upload was successful
    if (!cloudinaryResult || !cloudinaryResult.secure_url) {
      throw new ApiError(500, "Failed to upload logo to Cloudinary");
    }

    // Update user's profile with the logo URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photo: cloudinaryResult.secure_url }, // Save the secure URL to the user's profile
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Logo uploaded successfully",
      data: {
        photo: cloudinaryResult.secure_url, // Return the URL of the uploaded logo
      },
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    throw new ApiError(500, "An error occurred while uploading the logo");
  }
});