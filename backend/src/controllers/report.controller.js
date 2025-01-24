import { Facility } from "../models/facility.model.js";
import { GenerateReport } from "../models/generate-report.model.js";
import { Report } from "../models/report.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addData = asyncHandler(async (req, res) => {
  const { facilityName, companyName, username } = req.body;

  if (!companyName || !username) {
    throw new ApiError(401, "Unauthorized Request to create new report");
  }

  // Verify that the username in the request matches the authenticated user
  // if (req.user.username !== username) {
  //   throw new ApiError(403, "Username mismatch");
  // }

  const report = await Report.create({
    facilityName,
    companyName,
    username,
    fuel: {},
    food: {},
    bioenergy: {},
    refrigerants: {},
    ehctd: {},
    wttfuel: {},
    material: {},
    waste: {},
    btls: {},
    ec: {},
    water: {},
    fg: {},
    homeOffice: {},
    ov: {},
    fa: {},
    utd: {},
  });

  console.log(report);
  if (!report) {
    throw new ApiError(500, "Could not create report");
  }

  const facility = await Facility.findOneAndUpdate(
    { facilityName: facilityName }, // Find facility by facilityName
    { $push: { reports: report._id } }, // Push the report ID to the reports array
    { new: true } // Return the updated document
  );

  if (!facility) {
    throw new ApiError(500, "facility not found");
  }

  res.status(201).json({
    success: true,
    data: {
      report: report,
    },
  });
});

export const getCompanyReport = asyncHandler(async (req, res) => {
  const { user } = req.body; // Accessing user from req.body

  if (!user) {
    throw new ApiError(401, "Cannot access reports");
  }

  try {
    // Fetching user reports based on companyName
    const userReports = await Report.find({
      companyName: user.companyName,
    }).select(
      "fuel utd food username bioenergy refrigerants ehctd wttfuel material waste btls ec water fg homeOffice ownedVehicles fa reportId companyName timePeriod reportName facilityName"
    );

    // Check if reports are found and send response accordingly
    if (!userReports || userReports.length === 0) {
      return res.status(404).json({
        message: "No reports found for the user.",
        data: "zero", // Send 'zero' if no reports are found
      });
    }

    // Send the reports data if found
    res.status(200).json({
      message: "Reports fetched successfully.",
      data: userReports, // Send the reports data
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw new ApiError(
      500,
      "Something went wrong while fetching user reports."
    );
  }
});

export const getUserReports = asyncHandler(async (req, res) => {
  const { reportId } = req.query;
  const { user } = req.body; // Accessing user from req.body  // console.log("getUserReports1", user, "userQ", userQ);
  if (!user) {
    throw new ApiError(401, "Cannot access reports");
  }
  try {
    let query = { companyName: user.companyName }; // Start with the base query

    // If reportId is defined, add it to the query
    if (reportId) {
      query.reportId = reportId;
    } else {
      // If reportId is not defined, add username to the query
      query.username = user.username;
    }
    //  console.log("getUserReports2", query);

    const userReports = await Report.findOne(query).select(
      "fuel utd food username bioenergy refrigerants ehctd wttfuel material waste btls ec water fg homeOffice ownedVehicles fa reportId companyName timePeriod reportName facilityName"
    );

    // console.log("getUserReports", userReports);
    if (!userReports || userReports.length === 0) {
      return res.status(400).json({
        message: "No reports found for the user.",
        data: "zero",
      });
    }
    res.status(200).json({
      message: "Reports fetched successfully.",
      data: userReports,
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw new ApiError(
      500,
      "Something went wrong while fetching user reports."
    );
  }
});

export const getCompanyGenReports = asyncHandler(async (req, res) => {
  const { companyName } = req.body; // Extracting data from the request body
  // console.log("getUserReports", companyName);
  if (!companyName) {
    throw new ApiError(
      400,
      "Username, companyName, and facilityName are required."
    );
  }

  try {
    // Find reports matching the given username, companyName, and facilityName
    const userReports = await GenerateReport.find({
      companyName: companyName,
    });

    // Check if reports are found
    if (!userReports || userReports.length === 0) {
      return res.status(404).json({
        message: "No reports found for the user.",
        data: "zero",
      });
    }

    // Return the found reports
    res.status(200).json({
      message: "Reports fetched successfully.",
      data: userReports,
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw new ApiError(
      500,
      "Something went wrong while fetching user reports."
    );
  }
});

export const getUserGenReports = asyncHandler(async (req, res) => {
  const { companyName, facilityName } = req.body; // Extracting data from the request body
  // console.log("getUserReports", companyName, facilityName);
  if (!companyName || !facilityName) {
    throw new ApiError(
      400,
      "Username, companyName, and facilityName are required."
    );
  }

  try {
    // Find reports matching the given username, companyName, and facilityName
    const userReports = await GenerateReport.find({
      companyName: companyName,
      facilityName: facilityName,
    });

    // Check if reports are found
    if (!userReports || userReports.length === 0) {
      return res.status(404).json({
        message: "No reports found for the user.",
        data: "zero",
      });
    }

    // Return the found reports
    res.status(200).json({
      message: "Reports fetched successfully.",
      data: userReports,
    });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw new ApiError(
      500,
      "Something went wrong while fetching user reports."
    );
  }
});

export const deleteReport = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  if (!reportId) {
    throw new ApiError(400, "Report ID is required.");
  }

  try {
    const report = await Report.findOne({ reportId });
    if (!report) {
      throw new ApiError(404, "No report found with the provided ID.");
    }
    if (report.username !== req.user.username) {
      console.log("report.username", report.username);
      console.log("req.user.username", req.user.username);
      throw new ApiError(401, "Invalid user request");
    }
    const ordered_by_username = report.username;
    const user = await User.findOne({ username: ordered_by_username });
    if (!user) {
      throw new ApiError(
        404,
        "No user found with the username associated with this report."
      );
    }
    const user_report_id = report._id;
    user.reports = user.reports.filter(
      (rep) => rep._id.toString() !== user_report_id.toString()
    );
    await user.save();
    await Report.deleteOne({ reportId });
    res.status(200).json({ message: "Report deleted successfully." });
    CSSMediaRule;
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while deleting the report.",
      error
    );
  }
});

export const getReportForTimeRange = asyncHandler(async (req, res) => {
  const { username, companyName, facilityName, reportId } = req.body; // Extract relevant fields from the request body

  if (!username || !companyName || !facilityName || !reportId) {
    // Check for missing fields in the request
    throw new ApiError(
      400,
      "All fields are required: username, companyName, facilityName, reportId."
    );
  }

  try {
    // Use an aggregation pipeline to filter the report array
    const userReports = await GenerateReport.aggregate([
      {
        $match: {
          username: username,
          companyName: companyName,
          facilityName: facilityName,
        },
      },
      {
        $addFields: {
          filteredReport: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$report",
                  as: "rep",
                  cond: { $eq: ["$$rep.reportId", reportId] },
                },
              },
              0, // Get the first (and only) matching element
            ],
          },
        },
      },
      {
        $project: {
          username: 1,
          companyName: 1,
          facilityName: 1,
          report: {
            reportId: "$filteredReport.reportId",
            reportName: "$filteredReport.reportName",
            report: "$filteredReport.report",
          },
          timePeriod: 1,
        },
      },
    ]);

    // Check if any report is found
    if (!userReports || userReports.length === 0 || !userReports[0].report) {
      return res.status(404).json({
        message: "No reports found for the provided criteria.",
        data: "zero",
      });
    }

    // Respond with the fetched report data
    res.status(200).json({
      message: "Report fetched successfully.",
      data: userReports[0], // Send the first (and only) document
    });
  } catch (error) {
    console.error("Error fetching user report:", error);
    throw new ApiError(500, "Something went wrong while fetching user report.");
  }
});

export const updateFuelData = asyncHandler(async (req, res) => {
  const { companyName, facilityName } = req.query;
  const { fuel } = req.body;
  // console.log("UpdateFuelDataQ", companyName, facilityName);
  if (!companyName || !facilityName || !fuel) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and fuel data are required."
    );
  }

  const report = await Report.findOne({
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update fuel data.");
  // }

  // Update the fuel data
  report.fuel = fuel;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Fuel data updated successfully",
    data: report.fuel,
  });
});

export const updateBioenergyData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { bioenergy } = req.body;

  if ( !companyName || !facilityName || !bioenergy) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and bioenergy data are required."
    );
  }

  const report = await Report.findOne({
    
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update bioenergy data.");
  // }

  // Update the bioenergy data
  report.bioenergy = bioenergy;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Bioenergy data updated successfully",
    data: report.bioenergy,
  });
});

export const updateRefrigerantsData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { refrigerants } = req.body;

  if ( !companyName || !facilityName || !refrigerants) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and refrigerants data are required."
    );
  }

  const report = await Report.findOne({
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update refrigerants data.");
  // }

  // Update the refrigerants data
  report.refrigerants = refrigerants;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Refrigerants data updated successfully",
    data: report.refrigerants,
  });
});

export const updateEHCTDData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { ehctd } = req.body;
  console.log("updateEHCTDData",  companyName, facilityName, ehctd);

  if ( !companyName || !facilityName || !ehctd) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and EHCTD data are required."
    );
  }

  const report = await Report.findOne({
    
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update EHCTD data.");
  // }

  // const { electricity, heating, cooling } = ehctd;

  // if (!electricity || !heating || !cooling) {
  //   throw new ApiError(
  //     400,
  //     "Electricity, heating, and cooling data are required."
  //   );
  // }

  // const electricityGEF = (0.6077 * electricity).toFixed(2);
  // const electricityTD = (0.0188 * electricity).toFixed(2);
  // const heatingGEF = (0.1707 * heating).toFixed(2);
  // const heatingTD = (0.009 * heating).toFixed(2);
  // const coolingGEF = (0.5469 * cooling).toFixed(2);

  // Update the EHCTD data
  report.ehctd = ehctd;
  // electricityGEF,
  // electricityTD,
  // heatingGEF,
  // heatingTD,
  // coolingGEF,

  await report.save();

  res.status(200).json({
    success: true,
    message: "EHCTD data updated successfully",
    data: report.ehctd,
  });
});

export const updateWTTFuelData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { wttfuel } = req.body;

  if ( !companyName || !facilityName || !wttfuel) {
    throw new ApiError(
      400,
      "Report ID, facilityName, CO2eWttFuels, and wttfuel are required."
    );
  }

  const report = await Report.findOne({  companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update WTTFuel data.");
  // }

  report.wttfuel = wttfuel;

  await report.save();
  // console.log("updateWTTFuelData", report.wttfuel);

  res.status(200).json({
    success: true,
    message: "WTTFuel data updated successfully",
    data: report.wttfuel,
  });
});

export const updateMaterialUseData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { material } = req.body;
  console.log("updateMaterialUseData",  companyName, facilityName);

  if (!companyName || !facilityName || !material) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and material data are required."
    );
  }

  const report = await Report.findOne({
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update Material Use data.");
  // }

  // Update the material use data
  report.material = material;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Material Use data updated successfully",
    data: report.material,
  });
});

export const updateWasteDisposalData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { waste } = req.body;

  if ( !companyName || !facilityName || !waste) {
    throw new ApiError(400, "Report ID, amounts, and total are required.");
  }

  const report = await Report.findOne({  companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(
  //     401,
  //     "Unauthorized access to update Waste Disposal data."
  //   );
  // }

  report.waste = waste;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Waste Disposal data updated successfully",
    data: report.waste,
  });
});

export const updateBTLSData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { btls } = req.body;

  if ( !btls || !companyName || !facilityName) {
    throw new ApiError(
      400,
      "Report ID, distance, landTotal, seaTotal, and total are required."
    );
  }

  const report = await Report.findOne({  companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update BTLS data.");
  // }

  report.btls = btls;

  await report.save();

  res.status(200).json({
    success: true,
    message: "BTLS data updated successfully",
    data: report.btls,
  });
});

export const updateECData = asyncHandler(async (req, res) => {
  // marked for review
  const {  companyName, facilityName } = req.query;
  const { ec } = req.body;

  if ( !companyName || !ec || !facilityName) {
    throw new ApiError(400, "Report ID, distance, and total are required.");
  }

  const report = await Report.findOne({ companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update EC data.");
  // }

  report.ec = ec;

  await report.save();

  res.status(200).json({
    success: true,
    message: "EC data updated successfully",
    data: report.ec,
  });
});

export const updateFoodData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { food } = req.body;

  if ( !companyName || !facilityName || !food) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and food data are required."
    );
  }

  const report = await Report.findOne({
    
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update food data.");
  // }

  // Update the food data
  report.food = food;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Food data updated successfully",
    data: report.food,
  });
});

export const updateWaterData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { water } = req.body;

  if ( !water || !companyName || !facilityName) {
    throw new ApiError(
      400,
      "Report ID and all water data parameters are required."
    );
  }

  const report = await Report.findOne({  companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update Water data.");
  // }

  report.water = water;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Water data updated successfully",
    data: report.water,
  });
});

export const updateFGData = asyncHandler(async (req, res) => {
  const {  companyName, facilityName } = req.query;
  const { fg } = req.body;

  if (!fg || !companyName || !facilityName) {
    throw new ApiError(400, "Report ID, amounts, and total are required.");
  }

  const report = await Report.findOne({ companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update FG data.");
  // }

  report.fg = fg;

  await report.save();

  res.status(200).json({
    success: true,
    message: "FG data updated successfully",
    data: report.fg,
  });
});

export const updateHomeOfficeData = asyncHandler(async (req, res) => {
  const { companyName, facilityName } = req.query;
  const { homeOffice } = req.body;

  if (!homeOffice || !companyName || !facilityName) {
    throw new ApiError(
      400,
      "Report ID and all home office data parameters are required."
    );
  }

  const report = await Report.findOne({ companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update home office data.");
  // }

  report.homeOffice = homeOffice;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Home office data updated successfully",
    data: report.homeOffice,
  });
});

export const updateOwnedVehiclesData = asyncHandler(async (req, res) => {
  const {companyName, facilityName } = req.query;
  const { ownedVehicles } = req.body;
  if (!ownedVehicles || !companyName || !facilityName) {
    throw new ApiError(400, "Report ID, distances, and total are required.");
  }

  const report = await Report.findOne({companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(
  //     401,
  //     "Unauthorized access to update owned vehicles data."
  //   );
  // }

  report.ownedVehicles = ownedVehicles;

  await report.save();
  console.log("ownedVehicles", report.ownedVehicles);

  res.status(200).json({
    success: true,
    message: "Owned vehicles data updated successfully",
    data: report.ownedVehicles,
  });
});

export const updateFAData = asyncHandler(async (req, res) => {
  const { companyName, facilityName } = req.query;
  // console.log("updateFAData", companyName, facilityName);
  const { hotelAccommodation, flightAccommodation } = req.body;

  if ( !companyName || !facilityName) {
    throw new ApiError(404, "Report not found.");
  }

  const report = await Report.findOne({ companyName, facilityName });
  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update FA data.");
  // }

  report.fa = { hotelAccommodation, flightAccommodation };

  await report.save();

  res.status(200).json({
    success: true,
    message: "FA data updated successfully",
    data: report.fa,
  });
});

export const updateUtdData = asyncHandler(async (req, res) => {
  const { companyName, facilityName } = req.query;
  const { utd } = req.body;
  // console.log("UpdateUtdDataQ", companyName, facilityName);
  if (!companyName || !facilityName || !utd) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and Utd data are required."
    );
  }

  const report = await Report.findOne({
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update Utd data.");
  // }

  // Update the Utd data
  report.utd = utd;

  await report.save();

  res.status(200).json({
    success: true,
    message: "Utd data updated successfully",
    data: report.updateFADatatd,
  });
});


export const changeCurrentTab = asyncHandler(async (req, res) => {
  const { current_tab } = req.body;
  const { reportId } = req.params;
  if (!current_tab) {
    throw new ApiError(401, "Invalid tab");
  }
  const report = await Report.findOne({ reportId });
  if (!report) {
    throw new ApiError(401, "Report not found for report id ", reportId);
  }
  report.current_tab = current_tab;
  await report.save();

  res.status(201).json({
    success: true,
    message: "Current tab saved",
  });
});

export const getCurrentTab = asyncHandler(async (req, res) => {
  const { reportId } = req.params;
  if (!reportId) {
    throw new ApiError(401, "Report id not given!");
  }
  const report = await Report.findOne({ reportId });
  if (!report) {
    throw new ApiError(401, "Report not found for report id ", reportId);
  }
  res.status(201).json({
    success: true,
    data: report.current_tab,
  });
});
