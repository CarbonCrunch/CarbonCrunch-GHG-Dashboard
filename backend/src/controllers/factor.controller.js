import asyncHandler from "express-async-handler";
import { Report } from "../models/report.model.js";
import { ApiError } from "../utils/ApiError.js";

export const CO2eFuel = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const fuel = JSON.parse(req.query.fuel);
    console.log("fuel", fuel, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !fuel) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and fuel data are required."
    );
  }

  const report = await Report.findOne({
    reportId,
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  if (report.username !== req.user.username) {
    throw new ApiError(401, "Unauthorized access to update fuel data.");
  }

  // Define conversion rates
  const conversionRates = {
    CNG: 0.44,
    LNG: 1.16,
    LPG: 1.56,
    "Natural gas": 2.02,
    "Natural gas (100% mineral blend)": 2.03,
    "Other petroleum gas": 0.94,
    "Aviation spirit": 2.33,
    "Aviation turbine fuel": 2.55,
    "Burning oil": 2.54,
    "Diesel (average biofuel blend)": 2.51,
    "Diesel (100% mineral diesel)": 2.71,
    "Fuel oil": 3.18,
    "Gas oil": 2.76,
    Lubricants: 2.75,
    Naphtha: 2.12,
    "Petrol (average biofuel blend)": 2.19,
    "Petrol (100% mineral petrol)": 2.34,
    "Processed fuel oils - residual oil": 3.18,
    "Processed fuel oils - distillate oil": 2.76,
    "Waste oils": 2.75,
    "Marine gas oil": 2.78,
    "Marine fuel oil": 3.11,
    "Coal (industrial)": 2403.84,
    "Coal (electricity generation)": 2252.34,
    "Coal (domestic)": 2883.26,
    "Coking coal": 3165.24,
    "Petroleum coke": 3386.86,
    "Coal (electricity generation - home produced)": 2248.82,
  };

  // Update the fuel data with calculated CO2e amounts
  const updatedFuelData = fuel.map((fuelEntry) => {
    const conversionRate = conversionRates[fuelEntry.fuelType];
    const CO2e = fuelEntry.amount * conversionRate;
    return { ...fuelEntry, CO2e };
  });

  // Update the report's fuel data and store CO2e
  report.fuel = updatedFuelData;
  report.CO2eFuel = updatedFuelData.reduce((acc, curr) => acc + curr.CO2e, 0);
  console.log("fuel", report.fuel);
  console.log("CO2eFuel", report.CO2eFuel);
  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: report.fuel,
  });
});


export const CO2eBioenergy = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const bioenergy = JSON.parse(req.query.bioenergy);

  if (!reportId || !companyName || !facilityName || !bioenergy) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and bioenergy data are required."
    );
  }

  const report = await Report.findOne({
    reportId,
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  if (report.username !== req.user.username) {
    throw new ApiError(401, "Unauthorized access to update bioenergy data.");
  }

  // Define conversion rates
  const conversionRates = {
    Bioethanol: 0.01,
    "Biodiesel ME": 0.17,
    "Biodiesel ME (from used cooking oil)": 0.17,
    "Biodiesel ME (from tallow)": 0.17,
    "Wood logs": 61.82,
    "Wood chips": 57.15,
    "Wood pellets": 72.62,
    "Grass/straw": 49.24,
    Biogas: 1.22,
    "Landfill gas": 0.69,
  };

  // Update the bioenergy data with calculated CO2e amounts
  const updatedBioenergyData = bioenergy.map((bioenergyEntry) => {
    const conversionRate = conversionRates[bioenergyEntry.fuelType];
    const CO2e = bioenergyEntry.amount * conversionRate;
    return { ...bioenergyEntry, CO2e };
  });

  // Update the report's bioenergy data and store CO2e
  report.bioenergy = updatedBioenergyData;
  report.CO2eBioenergy = updatedBioenergyData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e for bioenergy calculated successfully",
    data: report.bioenergy,
  });
});
export const CO2eRefrigerants = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const refrigerants = JSON.parse(req.query.refrigerants);

  if (!reportId || !companyName || !facilityName || !refrigerants) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and refrigerants data are required."
    );
  }

  const report = await Report.findOne({
    reportId,
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  if (report.username !== req.user.username) {
    throw new ApiError(401, "Unauthorized access to update refrigerants data.");
  }

  // Define conversion rates
  const conversionRates = {
    "Carbon dioxide": 1,
    Dimethylether: 1,
    "R290 = propane": 3,
    "R600A = isobutane": 3,
    "Methyl bromide": 5,
    "Methylene chloride": 9,
    Methane: 25,
    "Methyl chloride": 13,
    "HFC-161": 12,
    "HFC-152": 53,
    "HFE-569sf2 (HFE-7200)": 59,
    "HCFC-123": 77,
    "HFC-41": 92,
    "HFE-356pcc3": 110,
    "HFC-152a": 124,
    "HCFC-225ca": 122,
    "HCFC-225cb": 595,
    "HFE-347mcc3": 575,
    "HFE-347pcf2": 580,
    "HFE-245fa2": 659,
    "HFE-245cb2": 708,
    "HFC-245ca": 693,
    "HCFC-124": 609,
    "HFC-365mfc": 794,
    "HFC-143": 353,
    "HFE-254cb2": 359,
    "HCFE-235da2": 350,
    "HFC-236ea": 1370,
    "HFC-236cb": 1340,
    "HFC-143a": 4470,
    "HFC-43-I0mee": 1640,
    "Halon-2402": 1640,
    R407C: 1774,
    R407F: 1825,
    "HCFC-142b": 2310,
    "HCFC-22/R22 = chlorodifluoromethane": 1810,
    "Halon-1211": 1890,
    "Halon-1301": 7140,
    R407A: 2107,
    R410A: 2088,
    "HFC-23": 14800,
    R403A: 3124,
    R408A: 3152,
    R404A: 3922,
    R507A: 3985,
    "HFC-125": 3500,
    "HFC-227ea": 3220,
    "HFC-236fa": 9810,
    "HFE-134": 6320,
    "HFE-125": 14900,
    "HFE-43-10pccc124 (H-Galden1040x)": 1870,
    "HFC-32": 675,
    R502: 4657,
    "HFC-134a": 1430,
    "HFC-134": 1100,
    "HFC-245fa": 1030,
    "Carbon tetrachloride": 1400,
    PFPMIE: 10300,
    "HFC-41": 92,
    "Perfluoromethane (PFC-14)": 7390,
    "CFC-12/R12 = dichlorodifluoromethane": 10900,
    "Perfluorocyclobutane (PFC-318)": 10300,
    "Perfluoropropane (PFC-218)": 8830,
    "Perfluorobutane (PFC-3-1-10)": 8860,
    "Perfluoroethane (PFC-116)": 12200,
    "Perfluorohexane (PFC-5-1-14)": 9300,
    "Nitrogen trifluoride": 17200,
    "Trifluoromethyl sulphur pentafluoride": 17700,
    "CFC-11/R11 = trichlorofluoromethane": 4750,
    "CFC-13": 14400,
    "CFC-113": 6130,
    "CFC-114": 10000,
    "CFC-115": 7370,
    R406A: 1943,
    R409A: 1585,
    R508B: 13396,
    Perfluorocyclopropane: 17340,
    "Nitrous oxide": 298,
    "Halon-2402": 1640,
  };

  // Update the refrigerants data with calculated CO2e amounts
  const updatedRefrigerantsData = refrigerants.map((refrigerantEntry) => {
    const conversionRate = conversionRates[refrigerantEntry.emission];
    const CO2e = refrigerantEntry.amount * conversionRate;
    return { ...refrigerantEntry, CO2e };
  });

  // Update the report's refrigerants data and store CO2e
  report.refrigerants = updatedRefrigerantsData;
  report.CO2eRefrigerants = updatedRefrigerantsData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e for refrigerants calculated successfully",
    data: report.refrigerants,
  });
});


export const CO2eEhctd = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const { ehctd } = req.body;

  if (!reportId || !companyName || !facilityName || !ehctd) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and EHCTD data are required."
    );
  }

  const report = await Report.findOne({
    reportId,
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  if (report.username !== req.user.username) {
    throw new ApiError(401, "Unauthorized access to update EHCTD data.");
  }

  // Define conversion rates
  const conversionRates = {
    Electricity: 1,
    "Heating and Steam": 25,
    "District Cooling": 298,
    R502: 4657,
  };

  // Update the EHCTD data with calculated CO2e amounts
  const updatedEhctdData = ehctd.map((ehctdEntry) => {
    const conversionRate = conversionRates[ehctdEntry.fuelType];
    const CO2e = ehctdEntry.amount * conversionRate;
    return { ...ehctdEntry, CO2e };
  });

  // Update the report's EHCTD data and store CO2e
  report.ehctd = updatedEhctdData;
  report.CO2eEhctd = updatedEhctdData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e for EHCTD calculated successfully",
    data: {
      ehctd: report.ehctd,
      CO2eEhctd: report.CO2eEhctd,
    },
  });
});

export const CO2eOv = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const ownedVehicles = JSON.parse(req.query.ownedVehicles);

  if (!reportId || !companyName || !facilityName || !ownedVehicles) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and OV data are required."
    );
  }

  const report = await Report.findOne({
    reportId,
    companyName,
    facilityName,
  });

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  if (report.username !== req.user.username) {
    throw new ApiError(401, "Unauthorized access to update OV data.");
  }

  // Define conversion rates
  const conversionRates = {
    "Small car - Plug-in Hybrid Electric Vehicle": 0.022,
    "Small car - Diesel": 0.138,
    "Small car - Hybrid": 0.105,
    "Small car - Petrol": 0.149,
    "Small car - Unknown": 0.145,
    "Medium car - Plug-in Hybrid Electric Vehicle": 0.069,
    "Medium car - Hybrid": 0.11,
    "Medium car - Diesel": 0.165,
    "Medium car - Petrol": 0.188,
    "Medium car - CNG": 0.159,
    "Medium car - LPG": 0.179,
    "Medium car - Unknown": 0.176,
    "Large car - Plug-in Hybrid Electric Vehicle": 0.077,
    "Large car - Hybrid": 0.152,
    "Large car - Diesel": 0.207,
    "Large car - Petrol": 0.279,
    "Large car - CNG": 0.236,
    "Large car - LPG": 0.266,
    "Large car - Unknown": 0.226,
    "Average car - Plug-in Hybrid Electric Vehicle": 0.071,
    "Average car - Hybrid": 0.114,
    "Average car - Diesel": 0.168,
    "Average car - Petrol": 0.174,
    "Average car - CNG": 0.165,
    "Average car - LPG": 0.177,
    "Average car - Unknown": 0.178,
    "Average motorbike - Diesel": 0.103,
    "Average motorbike - Petrol": 0.103,
    "Average motorbike - Hybrid": 0.103,
    "Average motorbike - CNG": 0.103,
    "Average motorbike - LPG": 0.103,
    "Average motorbike - Unknown": 0.103,
    "Average taxi - Diesel": 0.198,
    "Average taxi - Petrol": 0.225,
    "Average taxi - Hybrid": 0.149,
    "Average taxi - CNG": 0.196,
    "Average taxi - LPG": 0.218,
    "Average taxi - Unknown": 0.211,
    "Large van - Diesel": 0.307,
    "Large van - Petrol": 0.323,
    "Large van - Hybrid": 0.207,
    "Large van - CNG": 0.284,
    "Large van - LPG": 0.29,
    "Large van - Unknown": 0.317,
    "Medium van - Diesel": 0.258,
    "Medium van - Petrol": 0.275,
    "Medium van - Hybrid": 0.203,
    "Medium van - CNG": 0.243,
    "Medium van - LPG": 0.253,
    "Medium van - Unknown": 0.271,
    "Small van - Diesel": 0.202,
    "Small van - Petrol": 0.218,
    "Small van - Hybrid": 0.138,
    "Small van - CNG": 0.186,
    "Small van - LPG": 0.2,
    "Small van - Unknown": 0.219,
    "Small car - Battery Electric Vehicle": 0.087,
    "Medium car - Battery Electric Vehicle": 0.138,
    "Large car - Battery Electric Vehicle": 0.16,
    "Average car - Battery Electric Vehicle": 0.144,
    "Small car - Plug-in Hybrid Electric Vehicle - ev": 0.087,
    "Small car - Battery Electric Vehicle - ev": 0.12,
    "Medium car - Plug-in Hybrid Electric Vehicle - ev": 0.057,
    "Medium car - Battery Electric Vehicle - ev": 0.138,
    "Large car - Plug-in Hybrid Electric Vehicle - ev": 0.074,
    "Large car - Battery Electric Vehicle - ev": 0.16,
    "Average car - Plug-in Hybrid Electric Vehicle - ev": 0.068,
    "Average car - Battery Electric Vehicle - ev": 0.144,
  };

  // Update the OV data with calculated CO2e amounts
  const updatedOvData = ownedVehicles.map((ovEntry) => {
    const key = `${ovEntry.level3} - ${ovEntry.fuel}`;
    const conversionRate = conversionRates[key];
    const CO2e = ovEntry.amount * conversionRate;
    return { ...ovEntry, CO2e };
  });

  // Update the report's OV data and store CO2e
  report.ownedVehicles = updatedOvData;
  report.CO2eOv = updatedOvData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e for OV calculated successfully",
    data: {
      ownedVehicles: report.ownedVehicles,
      CO2eOv: report.CO2eOv,
    },
  });
});
