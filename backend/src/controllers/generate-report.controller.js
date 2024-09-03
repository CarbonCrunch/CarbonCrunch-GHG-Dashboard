import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { GenerateReport } from "../models/generate-report.model.js";
import { Report } from "../models/report.model.js";


export const createNewReport = asyncHandler(async (req, res) => {
  const { reportName, facilityName, timePeriod, companyName, username } =
    req.body;

  if (!companyName || !username) {
    throw new ApiError(401, "Unauthorized Request to create new report");
  }

  // Find the reports for the specific companyName and facilityName
  const reports = await GenerateReport.find({
    companyName,
    facilityName,
  })
    .sort({ "report.reportId": -1 })
    .exec();

  // Check if there are any reports and then find the last reportId
  let reportId = "000001"; // Default starting reportId

  if (reports.length > 0) {
    const lastReport = reports[0]; // The last report with the highest reportId
    const lastReportId = parseInt(lastReport.report[0].reportId, 10);

    if (!isNaN(lastReportId)) {
      reportId = (lastReportId + 1).toString().padStart(6, "0");
    }
  }

  // First, find reports related to the specific companyName and facilityName
  const relatedReports = await Report.find({
    companyName,
    facilityName,
  }).exec();

  // Now, execute the .find method with the date filter within the reports found
  const reportsData = await Report.find({
    _id: { $in: relatedReports.map((report) => report._id) }, // Filter within the related reports
    $or: [
      { "fuel.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "bioenergy.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "food.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "refrigerants.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "ehctd.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "wttfuel.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "material.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "waste.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "btls.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "ec.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "water.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "fg.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      { "homeOffice.date": { $gte: timePeriod.start, $lte: timePeriod.end } },
      {
        "ownedVehicles.date": { $gte: timePeriod.start, $lte: timePeriod.end },
      },
      {
        "fa.hotelAccommodation.date": {
          $gte: timePeriod.start,
          $lte: timePeriod.end,
        },
      },
      {
        "fa.flightAccommodation.date": {
          $gte: timePeriod.start,
          $lte: timePeriod.end,
        },
      },
    ],
  }).exec();

  // Prepare the report object for GenerateReport schema
  const reportObject = {
    reportId: reportId,
    reportName: reportName,
    report: {
      fuel: reportsData.map((data) => data.fuel || []).flat(),
      bioenergy: reportsData.map((data) => data.bioenergy || []).flat(),
      food: reportsData.map((data) => data.food || []).flat(),
      refrigerants: reportsData.map((data) => data.refrigerants || []).flat(),
      ehctd: reportsData.map((data) => data.ehctd || []).flat(),
      wttfuel: reportsData.map((data) => data.wttfuel || []).flat(),
      material: reportsData.map((data) => data.material || []).flat(),
      waste: reportsData.map((data) => data.waste || []).flat(),
      btls: reportsData.map((data) => data.btls || []).flat(),
      ec: reportsData.map((data) => data.ec || []).flat(),
      water: reportsData.map((data) => data.water || []).flat(),
      fg: reportsData.map((data) => data.fg || []).flat(),
      homeOffice: reportsData.map((data) => data.homeOffice || []).flat(),
      ownedVehicles: reportsData.map((data) => data.ownedVehicles || []).flat(),
      fa: {
        hotelAccommodation: reportsData
          .map((data) => data.fa.hotelAccommodation || [])
          .flat(),
        flightAccommodation: reportsData
          .map((data) => data.fa.flightAccommodation || [])
          .flat(),
      },
    },
  };

  // Create a new report in the GenerateReport schema
  const newReport = await GenerateReport.create({
    username, // Added directly in the create parameters
    companyName, // Added directly in the create parameters
    facilityName, // Added directly in the create parameters
    createdAt: new Date(),
    report: [reportObject], // Insert report array with reportId and reportName
    timePeriod,
  });

  if (!newReport) {
    throw new ApiError(500, "Could not create the new report");
  }

  //   // Update user's reports list
  //   const userUpdate = await User.findByIdAndUpdate(req.user._id, {
  //     $push: { reports: newReport._id },
  //   });

  //   if (!userUpdate) {
  //     throw new ApiError(500, "User not found");
  //   }

  res.status(201).json({
    success: true,
    data: {
      reportId: newReport.report[0].reportId,
      reportName: newReport.report[0].reportName,
    },
  });
});
