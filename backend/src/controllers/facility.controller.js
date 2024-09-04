import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Facility } from "../models/facility.model.js";
import { User } from "../models/user.model.js";

export const createNewFacility = asyncHandler(async (req, res) => {
  const { facilityName, facilityLocation } = req.body;

  // Validate request data
  if ( !facilityName || !facilityLocation) {
    throw new ApiError(
      401,
      "Unauthorized request or missing data to create a new facility"
    );
  }

  // Create a new facility
  const facility = await Facility.create({
    facilityName,
    facilityLocation,
  });

  if (!facility) {
    throw new ApiError(500, "Could not create facility");
  }

  // Since we are not associating the facility with the user in this step, we simply return the facility details
  res.status(201).json({
    success: true,
    data: {
      facilityId: facility._id,
      facilityName: facility.facilityName,
      facilityLocation: facility.facilityLocation,
    },
  });
});

export const createPermission = asyncHandler(async (req, res) => {
  const { username, facilityName, permissions } = req.body;
  //   console.log("createPermission", req.body);
  // Validate request data
  if ( !facilityName || !username) {
    throw new ApiError(
      401,
      "Unauthorized request or missing data to create or update permissions"
    );
  }

  // Find the facility by facilityName
  const facility = await Facility.findOne({ facilityName });

  if (!facility) {
    throw new ApiError(404, "Facility not found");
  }

  // Check if the user already exists in userRoles
  const userRoleIndex = facility.userRoles.findIndex(
    (role) => role.username === username
  );

  if (userRoleIndex !== -1) {
    throw new ApiError(400, "User already exists in the facility");
  }

  const isFullAccess = permissions === true;
  console.log("isFullAccess", isFullAccess);

  // If fullAccess is true, directly set fullAccess for the specified user in this facility
  if (isFullAccess) {
    // Add user with fullAccess to userRoles
    facility.userRoles.push({
      username,
      fullAccess: true,
      permissions: [], // Clear specific permissions as full access is granted
    });
  } else {
    // If user does not exist and fullAccess is not granted, add the user to userRoles with specific permissions
    facility.userRoles.push({
      username,
      fullAccess: false,
      permissions: permissions.map((perm) => ({
        entity: perm.category,
        actions: [perm.action],
      })),
    });
  }

  await facility.save();

  res.status(201).json({
    success: true,
    data: facility,
  });
});

export const getCompanyFacilities = asyncHandler(async (req, res) => {
  // Extract companyName from req.query
  const { companyName } = req.query;
  // Validate request data
  if (!companyName) {
    throw new ApiError(400, "Company name is required to fetch facilities");
  }
  
  try {
    // Find facilities with the given companyName
    const facilities = await User.find({ companyName });
    console.log("getCompanyFacilities", facilities);

    if (!facilities || facilities.length === 0) {
      throw new ApiError(404, "No facilities found for the given company name");
    }

    // Return the found facilities
    res.status(200).json({
      success: true,
      data: facilities,
    });
  } catch (error) {
    throw new ApiError(500, "An error occurred while fetching facilities");
  }
});

export const deleteCompanyFacilities = asyncHandler(async (req, res) => {});
