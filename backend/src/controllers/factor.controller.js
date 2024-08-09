import asyncHandler from "express-async-handler";
import { Report } from "../models/report.model.js";
import { ApiError } from "../utils/ApiError.js";

export const CO2eFuel = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const fuel = JSON.parse(req.query.fuel);
  // console.log("fuel", fuel, reportId, companyName, facilityName);

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
  // console.log("fuel", report.fuel);
  // console.log("CO2eFuel", report.CO2eFuel);
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
// console.log("refrigerants", refrigerants, reportId, companyName, facilityName);
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
  const ehctd = JSON.parse(req.query.ehctd);
  // console.log("ehctd", ehctd, reportId, companyName, facilityName);

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
  const updatedEhctdData = ehctd.map((entry) => {
    const conversionRate = conversionRates[entry.activity];
    const CO2e = parseFloat(entry.amount) * conversionRate;
    return { ...entry, CO2e };
  });

  // Update the report's EHCTD data and store CO2e
  report.ehctd = updatedEhctdData;
  report.CO2eEhctd = updatedEhctdData.reduce((acc, curr) => acc + curr.CO2e, 0);
  // console.log("ehctd", report.ehctd);
  // console.log("CO2eEhctd", report.CO2eEhctd);
  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for EHCTD",
    data: report.ehctd,
  });
});

export const CO2eEc = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const ec = JSON.parse(req.query.ec);
  // console.log("ec", ec, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !ec) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and employee commuting data are required."
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
    throw new ApiError(
      401,
      "Unauthorized access to update employee commuting data."
    );
  }

  const conversionRates = {
    "Cars (by size)": {
      "Small car": {
        "Battery Electric Vehicle": 0.05,
        CNG: 0,
        Diesel: 0.14,
        Hybrid: 0.1,
        LPG: 0,
        Petrol: 0.15,
        "Plug-in Hybrid Electric Vehicle": 0.06,
        Unknown: 0.15,
      },
      "Medium car": {
        "Battery Electric Vehicle": 0.05,
        CNG: 0.16,
        Diesel: 0.16,
        Hybrid: 0.11,
        LPG: 0.18,
        Petrol: 0.19,
        "Plug-in Hybrid Electric Vehicle": 0.09,
        Unknown: 0.18,
      },
      "Large car": {
        "Battery Electric Vehicle": 0.06,
        CNG: 0.24,
        Diesel: 0.21,
        Hybrid: 0.15,
        LPG: 0.27,
        Petrol: 0.28,
        "Plug-in Hybrid Electric Vehicle": 0.1,
        Unknown: 0.23,
      },
      "Average car": {
        "Battery Electric Vehicle": 0.05,
        CNG: 0.18,
        Diesel: 0.17,
        Hybrid: 0.12,
        LPG: 0.2,
        Petrol: 0.17,
        "Plug-in Hybrid Electric Vehicle": 0.1,
        Unknown: 0.17,
      },
    },
    Ferry: {
      "Foot passenger": 0.02,
      "Car passenger": 0.13,
      "Average (all passenger)": 0.11,
    },
    Motorbike: {
      Small: 0.08,
      Medium: 0.1,
      Large: 0.13,
      Average: 0.11,
    },
    Taxis: {
      "Regular taxi": {
        km: 0.21,
        "passenger.km": 0.15,
      },
      "Black cab": {
        km: 0.31,
        "passenger.km": 0.2,
      },
    },
    Bus: {
      "Local bus (not London)": 0.12,
      "Local London bus": 0.08,
      "Average local bus": 0.1,
      Coach: 0.03,
    },
    Rail: {
      "National rail": 0.04,
      "International rail": 0.0,
      "Light rail and tram": 0.03,
      "London Underground": 0.03,
    },
  };

  const updatedEcData = ec.map((entry) => {
    let conversionRate = 0;

    if (entry.vehicle === "car") {
      conversionRate =
        conversionRates["Cars (by size)"]["Average car"][entry.fuel];
    } else if (entry.vehicle === "Motorbike") {
      conversionRate = conversionRates["Motorbike"]["Average"];
    } else if (entry.type === "Regular taxi" || entry.type === "Black cab") {
      conversionRate =
        conversionRates["Taxis"][entry.type][entry.unit.toLowerCase()];
    } else if (entry.vehicle === "Ferry") {
      conversionRate = conversionRates["Ferry"][entry.type];
    } else if (entry.vehicle === "Bus") {
      conversionRate = conversionRates["Bus"][entry.type];
    } else if (entry.vehicle === "Rail") {
      conversionRate = conversionRates["Rail"][entry.type];
    }

    if (conversionRate === undefined) {
      console.warn(`No conversion rate found for: ${JSON.stringify(entry)}`);
      conversionRate = 0;
    }

    const CO2e = parseFloat(entry.distance) * conversionRate;
    return { ...entry, CO2e };
  });

  report.ec = updatedEcData;
  report.CO2eEc = updatedEcData.reduce(
    (acc, curr) => acc + (curr.CO2e || 0),
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for employee commuting",
    data: report.ec,
  });
});

export const CO2eBtls = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const btls = JSON.parse(req.query.btls);
  // console.log("btls", btls, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !btls) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and BTLS data are required."
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
    throw new ApiError(401, "Unauthorized access to update BTLS data.");
  }

  const conversionRates = {
    "Cars (by size)": {
      "Small car": {
        "Battery Electric Vehicle": 0.05,
        CNG: 0,
        Diesel: 0.14,
        Hybrid: 0.1,
        LPG: 0,
        Petrol: 0.15,
        "Plug-in Hybrid Electric Vehicle": 0.06,
        Unknown: 0.15,
      },
      "Medium car": {
        "Battery Electric Vehicle": 0.05,
        CNG: 0.16,
        Diesel: 0.16,
        Hybrid: 0.11,
        LPG: 0.18,
        Petrol: 0.19,
        "Plug-in Hybrid Electric Vehicle": 0.09,
        Unknown: 0.18,
      },
      "Large car": {
        "Battery Electric Vehicle": 0.06,
        CNG: 0.24,
        Diesel: 0.21,
        Hybrid: 0.15,
        LPG: 0.27,
        Petrol: 0.28,
        "Plug-in Hybrid Electric Vehicle": 0.1,
        Unknown: 0.23,
      },
      "Average car": {
        "Battery Electric Vehicle": 0.05,
        CNG: 0.18,
        Diesel: 0.17,
        Hybrid: 0.12,
        LPG: 0.2,
        Petrol: 0.17,
        "Plug-in Hybrid Electric Vehicle": 0.1,
        Unknown: 0.17,
      },
    },
    Taxis: {
      "Regular taxi": {
        km: 0.21,
        "passenger.km": 0.15,
      },
      "Black cab": {
        km: 0.31,
        "passenger.km": 0.2,
      },
    },
    Motorbike: {
      Small: 0.08,
      Medium: 0.1,
      Large: 0.13,
      Average: 0.11,
    },
  };

  // Update the BTLS data with calculated CO2e amounts
  const updatedBtlsData = btls.map((btlsEntry) => {
    const { vehicle, type, fuel, distance, unit } = btlsEntry;
    let conversionRate = 0;

    if (vehicle === "Cars (by size)") {
      conversionRate = conversionRates[vehicle]["Average car"][fuel];
    } else if (vehicle === "Motorbike") {
      conversionRate = conversionRates[vehicle]["Average"];
    } else if (vehicle === "Taxis" && conversionRates[vehicle][type]) {
      conversionRate = conversionRates[vehicle][type][unit.toLowerCase()];
    }

    if (conversionRate === undefined) {
      console.warn(
        `No conversion rate found for: ${JSON.stringify(btlsEntry)}`
      );
      conversionRate = 0;
    }

    const CO2e = parseFloat(distance) * conversionRate;
    return { ...btlsEntry, CO2e };
  });

  // Update the report's BTLS data and store CO2e
  report.btls = updatedBtlsData;
  report.CO2eBtls = updatedBtlsData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for BTLS",
    data: report.btls,
  });
});

export const CO2eFg = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const fg = JSON.parse(req.query.fg);

  if (!reportId || !companyName || !facilityName || !fg) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and freighting goods data are required."
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
    throw new ApiError(
      401,
      "Unauthorized access to update freighting goods data."
    );
  }

  // Define conversion rates based on the provided information
  const conversionRates = {
    Vans: {
      "Class I (up to 1.305 tonnes)": {
        Diesel: 0.81,
        Petrol: 1.07,
        CNG: 0,
        LPG: 0,
        Unknown: 0,
        "Plug-in Hybrid Electric Vehicle": 0,
        "Battery Electric Vehicle": 0.19,
      },
      "Class II (1.305 to 1.74 tonnes)": {
        Diesel: 0.63,
        Petrol: 0.72,
        CNG: 0,
        LPG: 0,
        Unknown: 0,
        "Plug-in Hybrid Electric Vehicle": 0,
        "Battery Electric Vehicle": 0.25,
      },
      "Class III (1.74 to 3.5 tonnes)": {
        Diesel: 0.59,
        Petrol: 0.78,
        CNG: 0,
        LPG: 0,
        Unknown: 0,
        "Plug-in Hybrid Electric Vehicle": 0,
        "Battery Electric Vehicle": 0.23,
      },
      "Average (up to 3.5 tonnes)": {
        Diesel: 0.6,
        Petrol: 0.72,
        CNG: 0.62,
        LPG: 0.68,
        Unknown: 0.61,
        "Plug-in Hybrid Electric Vehicle": 0,
        "Battery Electric Vehicle": 0.25,
      },
    },
    "HGV (all diesel)": {
      "Rigid (>3.5 - 7.5 tonnes)": { "Average laden": 0.49 },
      "Rigid (>7.5 tonnes-17 tonnes)": { "Average laden": 0.34 },
      "Rigid (>17 tonnes)": { "Average laden": 0.18 },
      "All rigids": { "Average laden": 0.21 },
      "Articulated (>3.5 - 33t)": { "Average laden": 0.13 },
      "Articulated (>33t)": { "Average laden": 0.08 },
      "All artics": { "Average laden": 0.08 },
      "All HGVs": { "Average laden": 0.11 },
    },
    "HGV refrigerated (all diesel)": {
      "Rigid (>3.5 - 7.5 tonnes)": { "Average laden": 0.58 },
      "Rigid (>7.5 tonnes-17 tonnes)": { "Average laden": 0.4 },
      "Rigid (>17 tonnes)": { "Average laden": 0.22 },
      "All rigids": { "Average laden": 0.25 },
      "Articulated (>3.5 - 33t)": { "Average laden": 0.15 },
      "Articulated (>33t)": { "Average laden": 0.09 },
      "All artics": { "Average laden": 0.09 },
      "All HGVs": { "Average laden": 0.13 },
    },
    "Freight flights": {
      "Domestic, to/from UK": { "With RF": 4.49, "Without RF": 2.38 },
      "Short-haul, to/from UK": { "With RF": 2.3, "Without RF": 1.22 },
      "Long-haul, to/from UK": { "With RF": 1.02, "Without RF": 0.54 },
      "International, to/from non-UK": { "With RF": 1.02, "Without RF": 0.54 },
    },
    Rail: {
      "Freight train": 0.03,
    },
    "Sea tanker": {
      "Crude tanker": {
        "200,000+ dwt": 0,
        "120,000–199,999 dwt": 0,
        "80,000–119,999 dwt": 0.01,
        "60,000–79,999 dwt": 0.01,
        "10,000–59,999 dwt": 0.01,
        "0–9999 dwt": 0.03,
        Average: 0,
      },
      "Products tanker": {
        "60,000+ dwt": 0.01,
        "20,000–59,999 dwt": 0.01,
        "10,000–19,999 dwt": 0.02,
        "5000–9999 dwt": 0.03,
        "0–4999 dwt": 0.05,
        Average: 0.01,
      },
      "Chemical tanker": {
        "20,000+ dwt": 0.01,
        "10,000–19,999 dwt": 0.01,
        "5000–9999 dwt": 0.02,
        "0–4999 dwt": 0.02,
        Average: 0.01,
      },
      "LNG tanker": {
        "200,000+ m3": 0.01,
        "0–199,999 m3": 0.01,
        Average: 0.01,
      },
      "LPG Tanker": {
        "50,000+ m3": 0.01,
        "0–49,999 m3": 0.04,
        Average: 0.01,
      },
    },
    "Cargo ship": {
      "Bulk carrier": {
        "200,000+ dwt": 0,
        "100,000–199,999 dwt": 0,
        "60,000–99,999 dwt": 0,
        "35,000–59,999 dwt": 0.01,
        "10,000–34,999 dwt": 0.01,
        "0–9999 dwt": 0.03,
        Average: 0,
      },
      "General cargo": {
        "10,000+ dwt": 0.01,
        "5000–9999 dwt": 0.02,
        "0–4999 dwt": 0.01,
        "10,000+ dwt 100+ TEU": 0.01,
        "5000–9999 dwt 100+ TEU": 0.02,
        "0–4999 dwt 100+ TEU": 0.02,
        Average: 0.01,
      },
      "Container ship": {
        "8000+ TEU": 0.01,
        "5000–7999 TEU": 0.02,
        "3000–4999 TEU": 0.02,
        "2000–2999 TEU": 0.02,
        "1000–1999 TEU": 0.03,
        "0–999 TEU": 0.04,
        Average: 0.02,
      },
      "Vehicle transport": {
        "4000+ CEU": 0.03,
        "0–3999 CEU": 0.06,
        Average: 0.04,
      },
      "RoRo-Ferry": {
        "2000+ LM": 0.05,
        "0–1999 LM": 0.06,
        Average: 0.05,
      },
      "Large RoPax ferry": { Average: 0.38 },
      "Refrigerated cargo": { "All dwt": 0.01 },
    },
  };

  // Update the freighting goods data with calculated CO2e amounts
  const updatedFgData = fg.map((fgEntry) => {
    const { vehicle, type, fuel, distance, unit } = fgEntry;
    let conversionRate = 0;

    if (conversionRates[vehicle]) {
      if (conversionRates[vehicle][type]) {
        if (typeof conversionRates[vehicle][type] === "object") {
          conversionRate = conversionRates[vehicle][type][fuel] || 0;
        } else {
          conversionRate = conversionRates[vehicle][type];
        }
      }
    }

    const CO2e = parseFloat(distance) * conversionRate;
    return { ...fgEntry, CO2e };
  });

  // Update the report's freighting goods data and store CO2e
  report.fg = updatedFgData;
  report.CO2eFg = updatedFgData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();
  // console.log("fg", report.fg );

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for freighting goods",
    data: report.fg,
  });
});


export const CO2eWttFuels = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const wttfuel = JSON.parse(req.query.wttfuel);
  // console.log("wttFuel", wttfuel, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !wttfuel) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and WTT fuels data are required."
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
    throw new ApiError(401, "Unauthorized access to update WTT fuels data.");
  }

  // Define conversion rates based on the provided information
  const conversionRates = {
    "WTT- gaseous fuels": {
      Butane: 0.19686,
      CNG: 0.09487,
      LNG: 0.39925,
      LPG: 0.18383,
      "Natural Gas": 0.34593,
      "Other Petroleum Gas": 0.11154,
      Propane: 0.18046,
      "Natural gas (100% mineral blend)": 0.34593,
    },
    "WTT- liquid fuels": {
      "Aviation Spirit": 0.59512,
      "Aviation Turbine Fuel": 0.52686,
      "Burning Oil": 0.52807,
      "Diesel (average biofuel blend)": 0.60986,
      "Diesel (100% mineral diesel)": 0.62874,
      "Fuel Oil": 0.69723,
      "Gas Oil": 0.63253,
      "Petrol (average biofuel blend)": 0.61328,
      "Petrol (100% mineral petrol)": 0.60283,
      "Processed fuel oils - residual oil": 0.82185,
      "Processed fuel oils - distillate oil": 0.70791,
      "Marine gas oil": 0.63253,
      "Marine fuel oil": 0.69723,
    },
  };

  // Update the WTT fuels data with calculated CO2e amounts
  const updatedWttFuelsData = wttfuel.map((fuelEntry) => {
    const { type, fuel, amount } = fuelEntry;
    let conversionRate = 0;

    if (conversionRates[type] && conversionRates[type][fuel]) {
      conversionRate = conversionRates[type][fuel];
    }

    const CO2e = parseFloat(amount) * conversionRate;
    return { ...fuelEntry, CO2e };
  });

  // Update the report's WTT fuels data and store CO2e
  report.wttfuel = updatedWttFuelsData;
  report.CO2eWttFuels = updatedWttFuelsData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for WTT fuels",
    data: report.wttfuel,
  });
});

export const CO2eMaterialUse = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const material = JSON.parse(req.query.material);
  // console.log("material", material, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !material) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and material use data are required."
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
    throw new ApiError(401, "Unauthorized access to update material use data.");
  }

  // Define conversion rates based on the provided information
  const conversionRates = {
    Construction: {
      Aggregates: 7.76,
      "Average construction": 79.97,
      Asbestos: 27.0,
      Asphalt: 39.21,
      Bricks: 241.76,
      Concrete: 131.76,
      Insulation: 1861.76,
      Metals: 3975.82,
      "Mineral oil": 1401.0,
      Plasterboard: 120.05,
      Tyres: 3335.57,
      Wood: 312.61,
    },
    Other: {
      Glass: 1402.77,
      Clothing: 22310.0,
      "Food and drink": 3701.4,
    },
    Organic: {
      "Compost derived from garden waste": 113.31,
      "Compost derived from food and garden waste": 116.13,
    },
    "Electrical items": {
      "Electrical items - fridges and freezers": 4363.33,
      "Electrical items - large": 3267.0,
      "Electrical items - IT": 24865.48,
      "Electrical items - small": 5647.95,
      "Batteries - Alkaline": 4633.48,
      "Batteries - Li ion": 6308.0,
      "Batteries - NiMh": 28380.0,
    },
    Metal: {
      "Metal: aluminium cans and foil (excl. forming)": 9122.64,
      "Metal: mixed cans": 5268.56,
      "Metal: scrap metal": 3682.68,
      "Metal: steel cans": 3100.64,
    },
    Plastic: {
      "Plastics: average plastics": 3116.29,
      "Plastics: average plastic film": 2574.16,
      "Plastics: average plastic rigid": 3276.71,
      "Plastics: HDPE (incl. forming)": 3269.84,
      "Plastics: LDPE and LLDPE (incl. forming)": 2600.64,
      "Plastics: PET (incl. forming)": 4032.39,
      "Plastics: PP (incl. forming)": 3104.73,
      "Plastics: PS (incl. forming)": 3777.95,
      "Plastics: PVC (incl. forming)": 3413.08,
    },
    Paper: {
      "Paper and board: board": 821.23,
      "Paper and board: mixed": 881.19,
      "Paper and board: paper": 919.4,
    },
  };

  // Update the material use data with calculated CO2e amounts
  const updatedMaterialUseData = material.map((materialEntry) => {
    const { type, fuel, amount } = materialEntry;
    let conversionRate = 0;

    if (conversionRates[type] && conversionRates[type][fuel]) {
      conversionRate = conversionRates[type][fuel];
    }

    const CO2e = parseFloat(amount) * conversionRate;
    return { ...materialEntry, CO2e };
  });

  // Update the report's material use data and store CO2e
  report.material = updatedMaterialUseData;
  report.CO2eMaterialUse = updatedMaterialUseData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for material use",
    data: report.material,
  });
});


export const CO2eWaste = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const waste = JSON.parse(req.query.waste);
  // console.log("waste", waste, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !waste) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and waste disposal data are required."
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
    throw new ApiError(
      401,
      "Unauthorized access to update waste disposal data."
    );
  }

  // Define conversion rates based on the provided information
  const conversionRates = {
    Construction: {
      Aggregates: 1.24,
      Asbestos: 5.92,
      Asphalt: 1.24,
      Bricks: 1.24,
      Concrete: 1.24,
      Insulation: 1.24,
      Metals: 1.26,
      Soils: 17.58,
      Plasterboard: 71.95,
      Wood: 828.03,
    },
    Other: {
      Books: 1041.8,
      Glass: 8.9,
      Clothing: 444.94,
    },
    Refuse: {
      "Household residual waste": 446.24,
      "Organic: food and drink waste": 626.87,
      "Organic: garden waste": 578.96,
      "Organic: mixed food and garden waste": 587.34,
      "Commercial and industrial waste": 467.05,
    },
    "Electrical items": {
      "WEEE - fridges and freezers": 8.9,
      "WEEE - large": 8.9,
      "WEEE - mixed": 8.9,
      "WEEE - small": 8.9,
      Batteries: 8.9,
    },
    Metal: {
      "Metal: aluminium cans and foil (excl. forming)": 8.9,
      "Metal: mixed cans": 8.9,
      "Metal: scrap metal": 8.9,
      "Metal: steel cans": 8.9,
    },
    Plastic: {
      "Plastics: average plastics": 8.9,
      "Plastics: average plastic film": 8.9,
      "Plastics: average plastic rigid": 8.9,
      "Plastics: HDPE (incl. forming)": 8.9,
      "Plastics: LDPE and LLDPE (incl. forming)": 8.9,
      "Plastics: PET (incl. forming)": 8.9,
      "Plastics: PP (incl. forming)": 8.9,
      "Plastics: PS (incl. forming)": 8.9,
      "Plastics: PVC (incl. forming)": 8.9,
    },
    Paper: {
      "Paper and board: board": 1041.8,
      "Paper and board: mixed": 1041.8,
      "Paper and board: paper": 1041.8,
    },
  };

  // Update the waste disposal data with calculated CO2e amounts
  const updatedWasteDisposalData = waste.map((wasteEntry) => {
    const { type, fuel, amount } = wasteEntry;
    let conversionRate = 0;

    if (conversionRates[type] && conversionRates[type][fuel]) {
      conversionRate = conversionRates[type][fuel];
    }

    const CO2e = parseFloat(amount) * conversionRate;
    return { ...wasteEntry, CO2e };
  });

  // Update the report's waste disposal data and store CO2e
  report.waste = updatedWasteDisposalData;
  report.CO2eWasteDisposal = updatedWasteDisposalData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for waste disposal",
    data: report.waste,
  });
});


export const CO2eFood = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const food = JSON.parse(req.query.food);
  // console.log("food", food, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !food) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and food disposal data are required."
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
    throw new ApiError(
      401,
      "Unauthorized access to update food disposal data."
    );
  }

  const conversionRates = {
    "1 standard breakfast": { unit: "breakfast", factor: 0.84 },
    "1 gourmet breakfast": { unit: "breakfast", factor: 2.33 },
    "1 cold or hot snack": { unit: "hot snack", factor: 2.02 },
    "1 average meal": { unit: "meal", factor: 4.7 },
    "Non-alcoholic beverage": { unit: "litre", factor: 0.2 },
    "Alcoholic beverage": { unit: "litre", factor: 1.87 },
    "1 hot snack (burger + frites)": { unit: "hot snack", factor: 2.77 },
    "1 sandwich": { unit: "sandwich", factor: 1.27 },
    "Meal, vegan": { unit: "meal", factor: 1.69 },
    "Meal, vegetarian": { unit: "meal", factor: 2.85 },
    "Meal, with beef": { unit: "meal", factor: 6.93 },
    "Meal, with chicken": { unit: "meal", factor: 3.39 },
  };

  // Update the food disposal data with calculated CO2e amounts
  const updatedFoodDisposalData = food.map((foodEntry) => {
    const { fuel, amount } = foodEntry; // Using 'fuel' based on provided example
    let conversionRate = 0;

    if (conversionRates[fuel]) {
      conversionRate = conversionRates[fuel].factor;
    }

    const CO2e = parseFloat(amount) * conversionRate;
    return { ...foodEntry, CO2e };
  });

  // Update the report's food disposal data and store CO2e
  report.food = updatedFoodDisposalData;
  report.CO2eFoodDisposal = updatedFoodDisposalData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for food disposal",
    data: report.food,
  });
});


export const CO2eOv = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const ownedVehicles = JSON.parse(req.query.ownedVehicles);
  // console.log(
  //   "ownedVehicles",
  //   ownedVehicles,
  //   reportId,
  //   companyName,
  //   facilityName
  // );

  if (!reportId || !companyName || !facilityName || !ownedVehicles) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and vehicle data are required."
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
    throw new ApiError(401, "Unauthorized access to update vehicle data.");
  }

  const conversionRates = {
    "Passenger vehicles": {
      "Cars (by size)": {
        "Small car": {
          "Plug-in Hybrid Electric Vehicle": { unit: "km", factor: 0.022 },
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.138 },
          Petrol: { unit: "km", factor: 0.149 },
          Hybrid: { unit: "km", factor: 0.105 },
          Unknown: { unit: "km", factor: 0.145 },
        },
        "Medium car": {
          "Plug-in Hybrid Electric Vehicle": { unit: "km", factor: 0.069 },
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.165 },
          Petrol: { unit: "km", factor: 0.188 },
          Hybrid: { unit: "km", factor: 0.11 },
          CNG: { unit: "km", factor: 0.159 },
          LPG: { unit: "km", factor: 0.179 },
          Unknown: { unit: "km", factor: 0.176 },
        },
        "Large car": {
          "Plug-in Hybrid Electric Vehicle": { unit: "km", factor: 0.077 },
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.207 },
          Petrol: { unit: "km", factor: 0.279 },
          Hybrid: { unit: "km", factor: 0.152 },
          CNG: { unit: "km", factor: 0.236 },
          LPG: { unit: "km", factor: 0.266 },
          Unknown: { unit: "km", factor: 0.226 },
        },
        "Average car": {
          "Plug-in Hybrid Electric Vehicle": { unit: "km", factor: 0.071 },
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.168 },
          Petrol: { unit: "km", factor: 0.174 },
          Hybrid: { unit: "km", factor: 0.12 },
          CNG: { unit: "km", factor: 0.176 },
          LPG: { unit: "km", factor: 0.198 },
          Unknown: { unit: "km", factor: 0.171 },
        },
      },
      Motorbike: {
        Small: { unit: "km", factor: 0.083 },
        Medium: { unit: "km", factor: 0.101 },
        Large: { unit: "km", factor: 0.132 },
        Average: { unit: "km", factor: 0.114 },
      },
    },
    "Delivery vehicles": {
      Vans: {
        "Class I (up to 1.305 tonnes)": {
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.147 },
          Petrol: { unit: "km", factor: 0.2 },
          CNG: { unit: "km", factor: 0 },
          LPG: { unit: "km", factor: 0 },
          Unknown: { unit: "km", factor: 0 },
        },
        "Class II (1.305 to 1.74 tonnes)": {
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.183 },
          Petrol: { unit: "km", factor: 0.198 },
          CNG: { unit: "km", factor: 0 },
          LPG: { unit: "km", factor: 0 },
          Unknown: { unit: "km", factor: 0 },
        },
        "Class III (1.74 to 3.5 tonnes)": {
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.265 },
          Petrol: { unit: "km", factor: 0.313 },
          CNG: { unit: "km", factor: 0 },
          LPG: { unit: "km", factor: 0 },
          Unknown: { unit: "km", factor: 0 },
        },
        "Average (up to 3.5 tonnes)": {
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.241 },
          Petrol: { unit: "km", factor: 0.21 },
          CNG: { unit: "km", factor: 0.245 },
          LPG: { unit: "km", factor: 0.27 },
          Unknown: { unit: "km", factor: 0.24 },
        },
      },
      "HGV (all diesel)": {
        "Rigid (>3.5 - 7.5 tonnes)": { unit: "km", factor: 0.481 },
        "Rigid (>7.5 tonnes-17 tonnes)": { unit: "km", factor: 0.587 },
        "Rigid (>17 tonnes)": { unit: "km", factor: 0.958 },
        "All rigids": { unit: "km", factor: 0.803 },
        "Articulated (>3.5 - 33t)": { unit: "km", factor: 0.77 },
        "Articulated (>33t)": { unit: "km", factor: 0.916 },
        "All artics": { unit: "km", factor: 0.91 },
        "All HGVs": { unit: "km", factor: 0.864 },
      },
      "HGVs refrigerated (all diesel)": {
        "Rigid (>3.5 - 7.5 tonnes)": { unit: "km", factor: 0.572 },
        "Rigid (>7.5 tonnes-17 tonnes)": { unit: "km", factor: 0.699 },
        "Rigid (>17 tonnes)": { unit: "km", factor: 1.14 },
        "All rigids": { unit: "km", factor: 0.956 },
        "Articulated (>3.5 - 33t)": { unit: "km", factor: 0.89 },
        "Articulated (>33t)": { unit: "km", factor: 1.06 },
        "All artics": { unit: "km", factor: 1.053 },
        "All HGVs": { unit: "km", factor: 1.012 },
      },
    },
    "UK electricity": { unit: "kWh", factor: 0.21233 },
  };

  // Update the vehicle data with calculated CO2e amounts
  const updatedVehicleData = ownedVehicles.map((vehicleEntry) => {
    const { level1, level2, level3, fuel, distance } = vehicleEntry; // Changed amount to distance
    let conversionRate = 0;

    if (
      conversionRates[level1] &&
      conversionRates[level1][level2] &&
      conversionRates[level1][level2][level3] &&
      conversionRates[level1][level2][level3][fuel]
    ) {
      conversionRate = conversionRates[level1][level2][level3][fuel].factor;
    }

    const CO2e = distance * conversionRate; // Changed amount to distance
    return { ...vehicleEntry, CO2e };
  });

  // Update the report's vehicle data and store CO2e
  report.ownedVehicles = updatedVehicleData;
  report.CO2eVehicle = updatedVehicleData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();
  // console.log("report.vehicleData", report.ownedVehicles);
  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for vehicles",
    data: report.ownedVehicles,
  });
});

export const CO2eWater = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const water = JSON.parse(req.query.water);
  // console.log("water", water, reportId, companyName, facilityName);

  if (!reportId || !companyName || !facilityName || !water) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and water data are required."
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
    throw new ApiError(401, "Unauthorized access to update water data.");
  }

  const conversionRates = {
    "Water Supply": { unit: "cubic meter", factor: 0.149 },
    "Water Treatment": { unit: "cubic meter", factor: 0.272 },
  };

  // Update the water data with calculated CO2e amounts
  const updatedWaterData = water.map((waterEntry) => {
    const { emission, amount } = waterEntry;
    let conversionRate = 0;

    if (conversionRates[emission]) {
      conversionRate = conversionRates[emission].factor;
    }

    const CO2e = parseFloat(amount) * conversionRate;
    return { ...waterEntry, CO2e };
  });

  // Update the report's water data and store CO2e
  report.water = updatedWaterData;
  report.CO2eWater = updatedWaterData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for water data",
    data: report.water,
  });
});


export const CO2eHome = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const homeOffice = JSON.parse(req.query.homeOffice);

  if (!reportId || !companyName || !facilityName || !homeOffice) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and home office data are required."
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
    throw new ApiError(401, "Unauthorized access to update home office data.");
  }

  // Define conversion rates
  const conversionRates = {
    "With Heating": 0.61,
    "With Cooling": 0.61,
    "No Heating/No Cooling": 0.61,
  };

  // Define consumption rates
  const consumptionRates = {
    "With Heating": 5.15,
    "With Cooling": 3.65,
    "No Heating/No Cooling": 0.15,
  };

  // Update the home office data with calculated CO2e amounts
  const updatedHomeOfficeData = homeOffice.map((homeEntry) => {
    const {
      numberOfEmployees,
      numberOfMonths,
      type,
      workingFromHome,
      workingRegime,
    } = homeEntry;
    const conversionRate = conversionRates[type];
    const consumption = consumptionRates[type];
    const workingHoursPerMonth = 160; // 1920 working hours/year divided by 12 months
    const hoursPerMonth = (workingRegime / 100) * workingHoursPerMonth;
    const hoursWorkingFromHome = (workingFromHome / 100) * hoursPerMonth;
    const CO2ePerEmployee = hoursWorkingFromHome * consumption * conversionRate;
    const CO2e = numberOfEmployees * CO2ePerEmployee * numberOfMonths;

    return { ...homeEntry, CO2e };
  });

  // Update the report's home office data and store CO2e
  report.homeOffice = updatedHomeOfficeData;
  report.CO2eHome = updatedHomeOfficeData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: report.homeOffice,
  });
});

export const CO2eFa = asyncHandler(async (req, res) => {
  const { reportId, companyName, facilityName } = req.query;
  const hotelAccommodation = JSON.parse(req.query.hotelAccommodation);
  // const flightAccommodation = JSON.parse(req.query.flightAccommodation); // Assuming this is also required

  if (!reportId || !companyName || !facilityName || !hotelAccommodation) {
    throw new ApiError(
      400,
      "Report ID, company name, facility name, and hotel accommodation data are required."
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
    throw new ApiError(
      401,
      "Unauthorized access to update accommodation data."
    );
  }

  // Define conversion factors
  const hotelFactor = 93.2;

  // Update the hotel accommodation data with calculated CO2e amounts
  const updatedHotelAccommodationData = hotelAccommodation.map((hotelEntry) => {
    const { occupiedRooms, nightsPerRoom } = hotelEntry;
    const CO2e = occupiedRooms * nightsPerRoom * hotelFactor;
    return { ...hotelEntry, CO2e };
  });

  // Assuming similar logic applies for flight accommodation
  // Define flight conversion factors if needed and update similarly

  // Update the report's accommodation data and store CO2e
  report.hotelAccommodation = updatedHotelAccommodationData;
  report.CO2eHotel = updatedHotelAccommodationData.reduce(
    (acc, curr) => acc + curr.CO2e,
    0
  );

  // Add flight accommodation logic here if needed
  // report.flightAccommodation = updatedFlightAccommodationData;
  // report.CO2eFlight = updatedFlightAccommodationData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: report.hotelAccommodation,
    // data: { hotelAccommodation: report.hotelAccommodation, flightAccommodation: report.flightAccommodation } // If flight data is included
  });
});
