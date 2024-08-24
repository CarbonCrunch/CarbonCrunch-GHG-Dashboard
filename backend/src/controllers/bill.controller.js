import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Bill } from "../models/bill.model.js";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dkiowo64c",
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY || "141629487434466",
  api_secret:
    process.env.CLOUDINARY_CLOUD_API_SECRET || "duCohk5LZqFdbHt4lux5lE5IXSQ",
});

export const getBills = asyncHandler(async (req, res) => {
  const { companyName, facilityName, username } = req.query;
  // console.log("getBills", companyName, facilityName, userId, username);

  // Validate required fields
  if (!companyName || !facilityName) {
    throw new ApiError(400, "Company name, and facility name are required.");
  }

  try {
    const bill = await Bill.find({
      companyName,
      facilityName,
    }).select(
      "billId billName username createdAt companyName facilityName timePeriod type_off_bill URL"
    );

    console.log("getBills", bill, username);

    if (!bill) {
      return res.status(404).json({
        message: "No bills found for the user.",
        data: "zero",
      });
    }

    // Check if the current user is authorized to view the bill
    // if (bill.username !== username) {
    //   throw new ApiError(401, "Unauthorized access to the bill.");
    // }

    // Send the bill to the frontend
    res.status(200).json({
      message: "Bill fetched successfully.",
      data: bill,
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    throw new ApiError(500, "Something went wrong while fetching the bill.");
  }
});

export const getCompanyBill = asyncHandler(async (req, res) => {
  const { companyName, username } = req.query;
  // console.log("getBills", companyName, facilityName, userId, username);

  // Validate required fields
  if (!companyName) {
    throw new ApiError(400, "Company name is required.");
  }

  try {
    const bill = await Bill.find({
      companyName,
    }).select(
      "billId billName username createdAt companyName facilityName timePeriod type_off_bill URL"
    );

    console.log("getCompanyBill", bill, username);

    if (!bill) {
      return res.status(404).json({
        message: "No bills found for the user.",
        data: "zero",
      });
    }

    // Check if the current user is authorized to view the bill
    // if (bill.username !== username) {
    //   throw new ApiError(401, "Unauthorized access to the bill.");
    // }

    // Send the bill to the frontend
    res.status(200).json({
      message: "Bill fetched successfully.",
      data: bill,
    });
  } catch (error) {
    console.error("Error fetching bill:", error);
    throw new ApiError(500, "Something went wrong while fetching the bill.");
  }
});

export const createBills = asyncHandler(async (req, res) => {
  const { billType, facilityName, companyName, username } = req.body;
  const file = req.files.file; // Access the uploaded file
  const user = JSON.parse(req.body.user);

  // console.log("createBills", {
  //   file,
  //   facilityName,
  //   companyName,
  //   username,
  //   billType,
  // });
  // console.log("User ", user);

  if (!user || !companyName || !username) {
    throw new ApiError(401, "Unauthorized request to create new bill");
  }

  // Generate billId
  const lastBill = await Bill.findOne().sort({ billId: -1 }).exec();
  let billId = "000001";
  if (lastBill && lastBill.billId) {
    const lastBillId = parseInt(lastBill.billId, 10);
    billId = (lastBillId + 1).toString().padStart(6, "0");
  }

  // Generate billName
  const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const billName = `${facilityName}_${billType}_${currentDate}_${billId}`;

  // Upload image to Cloudinary
  let cloudinaryResult;
  if (file) {
    cloudinaryResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "bills",
    });
  }
  // console.log("Cloudinary result:", cloudinaryResult);

  // Create the bill
  const bill = await Bill.create({
    billId,
    billName,
    username,
    companyName,
    facilityName,
    type_off_bill: billType,
    URL: cloudinaryResult ? cloudinaryResult.secure_url : null,
  });

  if (!bill) {
    throw new ApiError(500, "Could not create bill");
  }

  // Add bill to user's bills array
  const ExistingUser = await User.findByIdAndUpdate(user._id, {
    $push: { bills: bill._id },
  });

  if (!ExistingUser) {
    throw new ApiError(500, "User not found");
  }

  res.status(201).json({
    success: true,
    data: {
      billId: bill.billId,
      billName: bill.billName,
      URL: bill.URL,
    },
  });
});

export const updateBill = asyncHandler(async (req, res) => {
  const { billId, companyName, facilityName } = req.query;
  const { data } = req.body; // Assuming the data you want to update is sent in the body

  // if (!billId || !data || !companyName || !facilityName) {
  //   throw new ApiError(
  //     400,
  //     "Bill ID, data, companyName, and facilityName are required."
  //   );
  // }
  // console.log("billId",billId)

  const bill = await Bill.findOne({ billId, companyName, facilityName });
  if (!bill) {
    throw new ApiError(404, "Bill not found.");
  }

  // Update the bill data
  bill.data = { ...bill.data, ...data }; // Merging new data with existing data

  await bill.save();

  res.status(200).json({
    success: true,
    message: "Bill updated successfully",
    data: bill,
  });
});
