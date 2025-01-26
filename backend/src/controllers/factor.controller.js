import asyncHandler from "express-async-handler";
import { Report } from "../models/report.model.js";
import { ApiError } from "../utils/ApiError.js";

export const CO2eFuel = asyncHandler(async (req, res) => {
  const { _id, companyName, fuel } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "company name and _id are required.");
  }

  const report = await Report.findById(_id);
  // console.log("reportF", report);

  if (!report) {
    console.log("report", report);
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update fuel data.");
  // }

  const conversionRates = {
    // Gaseous fuels
    Butane: {
      tonnes: 3033.38067,
      litres: 1.74532,
    },
    CNG: {
      tonnes: 2568.16441,
      litres: 0.44942,
    },
    LNG: {
      tonnes: 2590.46441,
      litres: 1.17216,
    },
    LPG: {
      tonnes: 2939.36095,
      litres: 1.55713,
    },
    "Natural Gas": {
      tonnes: 2568.16441,
      litres: 2.04542,
    },
    "Natural Gas (100% Mineral Blend)": {
      tonnes: 2590.46441,
      litres: 2.06318,
    },
    "Other Petroleum Gas": {
      tonnes: 2578.24647,
      litres: 0.94441,
    },
    Propane: {
      tonnes: 2997.63233,
      litres: 1.54357,
    },
    "Aviation Spirit": {
      tonnes: 3193.6948,
      litres: 2.33116,
    },

    // Liquid fuels
    "Fuel Oil": {
      tonnes: 3228.89019,
      litres: 3.17493,
    },
    "Gas Oil": {
      tonnes: 3226.57859,
      litres: 2.75541,
    },
    Lubricants: {
      tonnes: 3180.99992,
      litres: 2.74934,
    },
    Naphtha: {
      tonnes: 3142.3789,
      litres: 2.11894,
    },
    "Petrol (average biofuel blend)": {
      tonnes: 2778.52935,
      litres: 2.0844,
    },
    "Petrol (100% mineral petrol)": {
      tonnes: 3154.08213,
      litres: 2.35372,
    },
    "Processed fuel oils - residual oil": {
      tonnes: 3228.89019,
      litres: 3.17493,
    },
    "Processed fuel oils - distillate oil": {
      tonnes: 3226.57859,
      litres: 2.75541,
    },
    "Refinery miscellaneous": {
      tonnes: 2944.32093,
      litres: 2.5649,
    },
    "Waste oils": {
      tonnes: 3219.37916,
      litres: 2.74923,
    },
    "Aviation Turbine Fuel": {
      tonnes: 3178.3652,
      litres: 2.54269,
    },
    "Burning Oil": {
      tonnes: 3165.04181,
      litres: 2.54015,
    },
    "Diesel (average biofuel blend)": {
      tonnes: 3014.09462,
      litres: 2.51279,
    },
    "Diesel (100% mineral diesel)": {
      tonnes: 3203.91143,
      litres: 2.66155,
    },

    // Solid fuels
    "Coal (industrial)": {
      tonnes: 2399.43994,
      litres: null,
    },
    "Coal (electricity generation)": {
      tonnes: 2262.11448,
      litres: null,
    },
    "Coal (domestic)": {
      tonnes: 2904.95234,
      litres: null,
    },
    "Coking coal": {
      tonnes: 3164.65002,
      litres: null,
    },
    "Petroleum coke": {
      tonnes: 3386.57168,
      litres: null,
    },
    "Coal (electricity generation - home produced coal)": {
      tonnes: 2258.5867,
      litres: null,
    },
  };

  // Calculation function
  if (!Array.isArray(report.fuel)) {
    console.log("fuel", report);
    throw new ApiError(400, "Fuel data must be an array.");
  }

  const updatedFuelData = report.fuel.map((fuelEntry) => {
    const fuelConversionRates = conversionRates[fuelEntry.fuelType];

    // Determine the conversion rate based on the unit
    const conversionRate =
      fuelEntry.unit === "Tonnes"
        ? fuelConversionRates.tonnes
        : fuelConversionRates.litres;

    const CO2e = fuelEntry.amount * conversionRate;
    return { ...fuelEntry, CO2e };
  });

  // Update the report's fuel data and store CO2e
  report.fuel = updatedFuelData;
  // report.CO2eFuel = updatedFuelData.reduce((acc, curr) => acc + curr.CO2e, 0);
  // console.log("CO2eFuel", report.fuel);
  // console.log("CO2eFuel", report.CO2eFuel);
  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: report.fuel,
  });
});

export const CO2eBioenergy = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and Id data are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  const conversionRates = {
    // Biofuels
    Bioethanol: {
      litres: 0.00901,
      kg: 0.01135,
      GJ: 0.42339,
    },
    "Biodiesel ME": {
      litres: 0.16751,
      kg: 0.18822,
      GJ: 5.05961,
    },
    "Biomethane (compressed)": {
      litres: 0.10625,
      kg: 0.00521,
      GJ: 5.05961,
    },
    "Biodiesel ME (from used cooking oil)": {
      litres: 0.16751,
      kg: 0.18822,
      GJ: 5.05961,
    },
    "Biodiesel ME (from tallow)": {
      litres: 0.16751,
      kg: 0.18822,
      GJ: 5.05961,
    },
    "Biodiesel HVO": {
      litres: 0.03558,
      kg: 0.04562,
      GJ: 1.03677,
    },
    Biopropane: {
      litres: 0.00214,
      kg: 0.00415,
      GJ: 0.08952,
    },
    "Development diesel": {
      litres: 0.03705,
      kg: 0.04461,
      GJ: 1.03677,
    },
    "Development petrol": {
      litres: 0.01409,
      kg: 0.01888,
      GJ: 0.42339,
    },
    "Off road biodiesel": {
      litres: 0.16751,
      kg: 0.18822,
      GJ: 5.05961,
    },
    "Biomethane (liquified)": {
      litres: 0.10625,
      kg: 0.00521,
      GJ: 5.05961,
    },
    "Methanol (bio)": {
      litres: 0.00669,
      kg: 0.00844,
      GJ: 0.42339,
    },
    "Avtur (renewable)": {
      litres: 0.02518,
      kg: 0.03185,
      GJ: 0.7234,
    },

    // Biomass
    "Wood logs": {
      tonnes: 46.25524,
      kWh: 0.01132,
    },
    "Wood chips": {
      tonnes: 42.76487,
      kWh: 0.01132,
    },
    "Wood pellets": {
      tonnes: 54.33654,
      kWh: 0.01132,
    },
    "Grass/straw": {
      tonnes: 54.08777,
      kWh: 0.01454,
    },

    // Biogas
    Biogas: {
      tonnes: 1.26431,
      kWh: 0.00023,
    },
    "Landfill gas": {
      tonnes: 0.69619,
      kWh: 0.0002,
    },
  };

  // Calculation function
  if (!Array.isArray(report.bioenergy)) {
    console.log("bioenergy", report);
    throw new ApiError(400, "Bioenergy data must be an array.");
  }

  const updatedBioenergyData = report.bioenergy.map((bioenergyEntry) => {
    const fuelConversionRates = conversionRates[bioenergyEntry.fuelType];

    // Determine the conversion rate based on the unit
    const conversionRate =
      fuelConversionRates[bioenergyEntry.unit.toLowerCase()];

    const CO2e = bioenergyEntry.amount * conversionRate;
    return { ...bioenergyEntry, CO2e };
  });

  // Update the report's bioenergy data and store CO2e
  report.bioenergy = updatedBioenergyData;
  // report.CO2eBioenergy = updatedBioenergyData.reduce(
  //   (acc, curr) => acc + curr.CO2e,
  //   0
  // );

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e for bioenergy calculated successfully",
    data: report.bioenergy,
  });
});

export const CO2eRefrigerants = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id data are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  const conversionRates = {
    // Blends (R-series)
    R401A: 1236,
    R401B: 1130,
    R401C: 876,
    R402A: 2261,
    R402B: 3100,
    R403A: 2547,
    R403B: 4821,
    R404A: 1780,
    R405A: 1624,
    R406A: 1674,
    R407A: 1474,
    R407B: 1924,
    R407C: 1557,
    R407D: 1659,
    R408A: 2048,
    R409A: 2172,
    R410A: 1274,
    R410B: 1375,
    R411A: 1468,
    R411B: 1619,
    R412A: 925,
    R413A: 1643,
    R414A: 2127,
    R415A: 1693,
    R416A: 2688,
    R417A: 2161,
    R418A: 1382,
    R419A: 2385,
    R420A: 2890,
    R421A: 2847,
    R422A: 2290,
    R423A: 2794,
    R424A: 2473,
    R425A: 2350,
    R426A: 2274,
    R427A: 2212,
    R428A: 1431,
    R429A: 1371,
    R430A: 2024,
    R431A: 3417,
    R432A: 15.3,
    R433A: 106,
    R434A: 40,
    R435A: 1.8,
    R436A: 0.64,
    R437A: 0.16,
    R438A: 0.55,
    R439A: 3076,
    R440A: 28.4,
    R441A: 1.35,
    R442A: 1.47,
    R443A: 1639,
    R444A: 2059,
    R445A: 1828,
    R446A: 156,
    R447A: 0.23,
    R448A: 1130,
    R449A: 876,

    // Kyoto Protocol Products
    "Carbon dioxide": 1,
    Methane: 28,
    "Nitrous oxide": 265,
    "HFC-23": 12400,
    "HFC-32": 677,
    "HFC-41": 116,
    "HFC-125": 3170,
    "HFC-134": 1120,
    "HFC-134a": 1300,
    "HFC-143a": 328,
    "HFC-152a": 138,
    "HFC-227ea": 3350,
    "HFC-236fa": 8060,
    "HFC-245fa": 858,
    "HFC-43-10mee": 1650,
    "Perfluoromethane (PFC-14)": 6630,
    "Perfluoroethane (PFC-116)": 11100,
    "Perfluoropropane (PFC-218)": 8900,
    "Perfluorocyclobutane (PFC-318)": 9540,
    "Perfluorobutane (PFC-4-1-10)": 9200,
    "Perfluoropentane (PFC-5-1-12)": 8550,
    "Perfluorohexane (PFC-6-1-14)": 7910,
    "PFC-9-1-18": 7190,
    Perfluorocyclopropane: 9200,
    "Sulphur hexafluoride (SF6)": 23500,

    // Montreal Protocol Products
    "CFC-11/R11": 4660,
    "CFC-12/R12": 10200,
    "CFC-13": 13900,
    "CFC-113": 5820,
    "CFC-114": 8590,
    "CFC-115": 7670,
    "Halon-1211": 1750,
    "Halon-1301": 6290,
    "Halon-2402": 1470,
    "Carbon tetrachloride": 1730,
    "Methyl bromide": 2,
    "Methyl chloroform": 160,
    "HCFC-22/R22": 1760,
    "HCFC-123": 79,
    "HCFC-124": 527,
    "HCFC-141b": 782,
    "HCFC-142b": 1980,
    "HCFC-225ca": 127,
    "HCFC-225cb": 525,
    "HCFC-21": 148,

    // Fluorinated Ethers
    "HFE-125": 12400,
    "HFE-134a": 5560,
    "HFE-143a": 523,
    "HCFE-225da2": 491,
    "HCFE-245cb2": 654,
    "HCFE-245fa2": 812,
    "HFE-254cb2": 301,
    "HFE-347mcc3": 530,
    "HFE-347pcf2": 889,
    "HFE-356pcc3": 413,
    "HFE-449sl (HFE-7100)": 421,
    "HFE-569sf2 (HFE-7200)": 57,
    "HFE-43-10pccc124 (H-Galden1040x)": 2820,
    "HFE-236ca12 (HG-10)": 5350,
    "HFE-338pcc13 (HG-01)": 2910,

    // Other Products
    "Trifluoromethyl sulphur pentafluoride": 17400,
    PFPMIE: 9710,
    Dimethylether: 1,
    "Methylene chloride": 9,
    "Methyl chloride": 12,
    R290: 0.06,
    R600a: 3,
    R600: 0.006,
    R601a: 5,
    R601: 5,
    R170: 0.437,
    R1270: 2,
    R1234yf: 1,
    R1234ze: 1,
  };

  // Calculation function
  const updatedRefrigerantsData = report.refrigerants.map(
    (refrigerantEntry) => {
      const conversionRate = conversionRates[refrigerantEntry.emission];
      const CO2e = refrigerantEntry.amount * conversionRate;
      return { ...refrigerantEntry, CO2e };
    }
  );

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

export const CO2eOv = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update vehicle data.");
  // }

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
      Motorbikes: {
        Small: { unit: "km", factor: 0.083 },
        Medium: { unit: "km", factor: 0.101 },
        Large: { unit: "km", factor: 0.132 },
        Average: { unit: "km", factor: 0.114 },
      },
    },
    "Delivery vehicles": {
      Vans: {
        "Small van": {
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.147 },
          Petrol: { unit: "km", factor: 0.2 },
          CNG: { unit: "km", factor: 0 },
          LPG: { unit: "km", factor: 0 },
          Unknown: { unit: "km", factor: 0 },
        },
        "Medium van": {
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.183 },
          Petrol: { unit: "km", factor: 0.198 },
          CNG: { unit: "km", factor: 0 },
          LPG: { unit: "km", factor: 0 },
          Unknown: { unit: "km", factor: 0 },
        },
        "Large van": {
          "Battery Electric Vehicle": { unit: "km", factor: 0 },
          Diesel: { unit: "km", factor: 0.265 },
          Petrol: { unit: "km", factor: 0.313 },
          CNG: { unit: "km", factor: 0 },
          LPG: { unit: "km", factor: 0 },
          Unknown: { unit: "km", factor: 0 },
        },
      },
    },
  };

  // Update the vehicle data with calculated CO2e amounts
  const updatedVehicleData = report.ownedVehicles.map((vehicleEntry) => {
    const { level1, level2, level3, fuel, distance } = vehicleEntry; // Ensure distance is used instead of amount
    let conversionRate = 0;

    // Special handling for Motorbikes
    if (level2 === "Motorbikes" && conversionRates[level1][level2][level3]) {
      conversionRate = conversionRates[level1][level2][level3].factor;
    }
    // Standard handling for other vehicles
    else if (
      conversionRates[level1] &&
      conversionRates[level1][level2] &&
      conversionRates[level1][level2][level3] &&
      conversionRates[level1][level2][level3][fuel]
    ) {
      conversionRate = conversionRates[level1][level2][level3][fuel].factor;
    } else {
      console.warn(
        `No conversion factor found for: ${JSON.stringify(vehicleEntry)}`
      );
    }

    const CO2e = parseFloat(distance) * conversionRate; // Calculate CO2e emissions based on distance
    return { ...vehicleEntry, CO2e };
  });

  // Update the report's vehicle data and store CO2e
  report.ownedVehicles = updatedVehicleData;
  report.CO2eVehicle = updatedVehicleData.reduce(
    (acc, curr) => acc + (curr.CO2e || 0), // Handle cases where CO2e might be undefined
    0
  );

  await report.save();
  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for vehicles",
    data: report.ownedVehicles,
  });
});

export const CO2eEhctd = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

 const emissionFactors = {
   Electricity: {
     lifecycleFactor: 0.6077,
     combustionFactor: 0.4233,
     TDLossFactor: 0.0188,
     regionalFactors: {
       "All India Average": 0.81,
       Northern: 0.92,
       Eastern: 0.95,
       Western: 0.86,
       Southern: 0.85,
       "North-Eastern": 0.83,
     },
   },
   "Heating and Steam": {
     lifecycleFactor: 0.1707,
     combustionFactor: 0.1232,
     TDLossFactor: 0.009,
   },
   "District Cooling": {
     lifecycleFactor: 0.5469,
     combustionFactor: 0.3845,
     TDLossFactor: 0.0278,
   },
 };

 const TD_LOSS_RATE = 0.0278;

 const updatedEhctdData = report.ehctd.map((entry) => {
   const { activity, amount, unit, entity, purpose, region } = entry;
   const factors = emissionFactors[activity];

   let CO2e = 0;

   if (entity === "Reporting Company") {
     const upstreamFactor =
       factors.lifecycleFactor -
       factors.combustionFactor -
       factors.TDLossFactor;
     CO2e = parseFloat(amount) * upstreamFactor;
   } else if (entity === "Suppliers") {
     CO2e = parseFloat(amount) * factors.lifecycleFactor * TD_LOSS_RATE;
   }

   if (purpose === "Resale") {
     CO2e = parseFloat(amount) * factors.lifecycleFactor;
   }

   // Apply regional factor for electricity if available
   if (
     activity === "Electricity" &&
     region &&
     factors.regionalFactors[region]
   ) {
     CO2e *= factors.regionalFactors[region];
   }

   return {
     ...entry,
     CO2e: parseFloat(CO2e.toFixed(4)),
     unit: "kgCO2e",
   };
 });

 const totalCO2e = updatedEhctdData.reduce((acc, curr) => acc + curr.CO2e, 0);

 report.ehctd = updatedEhctdData;
 report.CO2eEhctd = parseFloat(totalCO2e.toFixed(4));

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for EHCTD",
    data: report.ehctd,
    totalCO2e: report.CO2eEhctd,
  });
});

export const CO2eEc = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // Conversion rate function
  function getConversionRate(vehicle, level, fuel, unit) {
    const conversionRates = {
      Car: {
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
      Taxi: {
        "Regular taxi": { km: 0.21, "passenger.km": 0.15 },
        "Black cab": { km: 0.31, "passenger.km": 0.2 },
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

    // Handle Taxi separately due to unit-specific rates
    if (vehicle === "Taxi") {
      return conversionRates.Taxi[level]?.[unit.toLowerCase()] || 0;
    }

    // Handle Car with fuel type
    if (vehicle === "Car") {
      return conversionRates.Car[level]?.[fuel] || 0;
    }

    // Handle other vehicles without additional specifics
    return conversionRates[vehicle]?.[level] || 0;
  }

  const updatedEcData = report.ec.map((entry) => {
    let CO2e = 0;

    switch (entry.method) {
      case "Fuel-based method":
        // Calculate emissions based on fuel quantity
        const fuelConversionRate = getConversionRate(
          entry.vehicle,
          entry.type,
          entry.fuel,
          entry.unit
        );
        CO2e = parseFloat(entry.quantityOfFuel) * fuelConversionRate;
        break;

      case "Distance-based method":
        // Calculate total distance
        const totalDistance =
          parseFloat(entry.distance) *
          2 *
          (parseFloat(entry.numberOfWorkingDays) || 250);
        const distanceConversionRate = getConversionRate(
          entry.vehicle,
          entry.type,
          entry.fuel,
          entry.unit
        );
        CO2e = totalDistance * distanceConversionRate;
        break;

      case "Average-data method":
        // Calculate emissions using employee count and transport mode
        const averageDistance = parseFloat(entry.distance) * 2;
        const averageConversionRate = getConversionRate(
          entry.vehicle,
          entry.type,
          entry.fuel,
          entry.unit
        );
        const totalEmployees = parseFloat(entry.totalNumberOfEmployees);
        const percentageUsingTransport =
          parseFloat(entry.percentageOfEmployeesUsingModeOfTransport) / 100;
        const workingDays = parseFloat(entry.numberOfWorkingDays) || 250;

        CO2e =
          totalEmployees *
          percentageUsingTransport *
          averageDistance *
          workingDays *
          averageConversionRate;
        break;

      default:
        // Fallback to default distance-based calculation
        const defaultConversionRate = getConversionRate(
          entry.vehicle,
          entry.type,
          entry.fuel,
          entry.unit
        );
        CO2e = parseFloat(entry.distance) * defaultConversionRate;
    }
    console.log("CO2e", CO2e);
    return { ...entry, CO2e };
  });

  // Save updated report
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
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update BTLS data.");
  // }

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
    Taxi: {
      "Average taxi": {
        km: 0.21,
        "passenger.km": 0.15,
      },
      "Black cab": {
        km: 0.31,
        "passenger.km": 0.2,
      },
    },
    Air: {
      Air: 0.29,
    },
    Rail: {
      Rail: 0.08,
    },
    Motorbike: {
      Small: 0.08,
      Medium: 0.1,
      Large: 0.13,
      Average: 0.11,
    },
  };

  const calculateEmissions = (btlsEntry) => {
    const { vehicle, type, fuel, distance, method, unit, cost, quantity } =
      btlsEntry;
    let CO2e = 0;
    // console.log("vehicle", btlsEntry);
    // console.log(
    //   "vehicle",
    //   conversionRates[vehicle][type][fuel],
    //   btlsEntry,
    //   vehicle,
    //   type,
    //   fuel
    // );

    switch (method) {
      case "Distance-based method":
        let conversionRate = 0;
        if (vehicle === "Cars (by size)") {
          conversionRate = conversionRates[vehicle][type][fuel];
        } else if (vehicle === "Motorbike") {
          conversionRate = conversionRates[vehicle][type];
        } else if (vehicle === "Air" && conversionRates[vehicle][type]) {
          conversionRate = conversionRates[vehicle][type];
        } else if (vehicle === "Rail" && conversionRates[vehicle][type]) {
          conversionRate = conversionRates[vehicle][type];
        }
        else if (vehicle === "Taxi" && conversionRates[vehicle][type]) {
          conversionRate = conversionRates[vehicle][type][unit.toLowerCase()];
        }
        CO2e = parseFloat(distance) * conversionRate;
        break;

      case "Fuel-based method":
        const fuelEmissionFactors = {
          "Plug-in Hybrid Electric Vehicle": 0.1,
          "Battery Electric Vehicle": 0.05,
          Diesel: 2.68,
          Petrol: 2.31,
          Hybrid: 1.5,
          Unknown: 2.0,
          CNG: 1.9,
          LPG: 1.7,
        };

        CO2e = parseFloat(quantity) * (fuelEmissionFactors[fuel] || 0);
        break;

      case "Spend-based method":
        const spendEmissionFactors = {
          "Cars (by size)": {
            "Small car": 0.3,
            "Medium car": 0.5,
            "Large car": 0.7,
            "Average car": 0.5,
          },
          Motorbike: {
            Small: 0.2,
            Medium: 0.3,
            Large: 0.4,
            Average: 0.3,
          },
          Taxi: {
            "Average taxi": 0.4,
          },
        };
        CO2e = parseFloat(cost) * (spendEmissionFactors[vehicle] || 0);
        break;

      default:
        console.warn(`Unknown method: ${method}`);
        CO2e = 0;
    }

    return CO2e;
  };

  // Update the BTLS data with calculated CO2e amounts
  const updatedBtlsData = report.btls.map((btlsEntry) => {
    // console.log("btlsEntry", report.btls);
    const CO2e = calculateEmissions(btlsEntry);
    return { ...btlsEntry, CO2e };
  });

  // Update the report's BTLS data and store total CO2e
  report.btls = updatedBtlsData;
  report.CO2eBtls = updatedBtlsData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for BTLS",
    method: report.btlsMethod,
    data: report.btls,
  });
});

export const CO2eFg = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(
  //     401,
  //     "Unauthorized access to update freighting goods data."
  //   );
  // }

  // Define conversion rates based on category and type only
  const conversionRates = {
    Vans: {
      "Class I (up to 1.305 tonnes)": 1.07,
      "Class II (1.305 to 1.74 tonnes)": 0.72,
      "Class III (1.74 to 3.5 tonnes)": 0.78,
    },
    "HGV (all diesel)": {
      "Rigid (>3.5 - 7.5 tonnes)": 0.49,
      "Rigid (>7.5 tonnes-17 tonnes)": 0.34,
      "Rigid (>17 tonnes)": 0.18,
      "All rigids": 0.21,
      "Articulated (>3.5 - 33t)": 0.13,
      "Articulated (>33t)": 0.08,
      "All artics": 0.08,
      "All HGVs": 0.11,
    },
    "HGV refrigerated (all diesel)": {
      "Rigid (>3.5 - 7.5 tonnes)": 0.58,
      "Rigid (>7.5 tonnes-17 tonnes)": 0.4,
      "Rigid (>17 tonnes)": 0.22,
      "All rigids": 0.25,
      "Articulated (>3.5 - 33t)": 0.15,
      "Articulated (>33t)": 0.09,
      "All artics": 0.09,
      "All HGVs": 0.13,
    },
    "Freight flights": {
      "Domestic, to/from UK": 2.38,
      "Short-haul, to/from UK": 1.22,
      "Long-haul, to/from UK": 0.54,
      "International, to/from non-UK": 0.54,
    },
    Rail: {
      "Freight train": 0.03,
    },
    "Sea tanker": {
      "Container ship": 0.02,
    },
    "Cargo ship": {
      "Container ship": 0.02,
    },
  };

  // Update the freighting goods data with calculated CO2e amounts
  const updatedFgData = report.fg.map((fgEntry) => {
    const { category, type, distance } = fgEntry;
    let conversionRate = 0;

    if (conversionRates[category]) {
      if (conversionRates[category][type]) {
        conversionRate = conversionRates[category][type];
      }
    }

    const CO2e = parseFloat(distance) * conversionRate;
    return { ...fgEntry, CO2e };
  });

  // Update the report's freighting goods data and store CO2e
  report.fg = updatedFgData;
  report.CO2eFg = updatedFgData.reduce((acc, curr) => acc + curr.CO2e, 0);

  await report.save();

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully for freighting goods",
    data: report.fg,
  });
});

export const CO2eWttFuels = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }
  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update WTT fuels data.");
  // }

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
  const updatedWttFuelsData = report.wttfuel.map((fuelEntry) => {
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
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update material use data.");
  // }

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
  const updatedMaterialUseData = report.material.map((materialEntry) => {
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
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(
  //     401,
  //     "Unauthorized access to update waste disposal data."
  //   );
  // }

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
      Landfill: 0.5,
      Recycling: 0.1,
      Incineration: 1.0,
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
  const updatedWasteDisposalData = report.waste.map((wasteEntry) => {
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
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(
  //     401,
  //     "Unauthorized access to update food disposal data."
  //   );
  // }

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
  const updatedFoodDisposalData = report.food.map((foodEntry) => {
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

export const CO2eWater = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update water data.");
  // }

  const conversionRates = {
    "Water Supply": { unit: "cubic meter", factor: 0.149 },
    "Water Treatment": { unit: "cubic meter", factor: 0.272 },
  };

  // Update the water data with calculated CO2e amounts
  const updatedWaterData = report.water.map((waterEntry) => {
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
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // if (report.username !== req.user.username) {
  //   throw new ApiError(401, "Unauthorized access to update home office data.");
  // }

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
  const updatedHomeOfficeData = report.homeOffice.map((homeEntry) => {
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
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);
  // console.log("reportFA",report);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  // Define conversion factors
  const hotelFactor = 93.2;

  // Update the hotel accommodation data with calculated CO2e amounts
  const updatedHotelAccommodationData = report.fa.hotelAccommodation.map(
    (hotelEntry) => {
      const { occupiedRooms, nightsPerRoom } = hotelEntry;
      const CO2e = occupiedRooms * nightsPerRoom * hotelFactor;
      return { ...hotelEntry, CO2e };
    }
  );

  // Update the report's accommodation data and store CO2e using findOneAndUpdate
  const updatedReport = await Report.findByIdAndUpdate(
    { _id },
    { $set: { "fa.hotelAccommodation": updatedHotelAccommodationData } },
    { new: true } // Returns the updated document
  );

  if (!updatedReport) {
    throw new ApiError(404, "Failed to update report accommodation data.");
  }

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: updatedReport.fa.hotelAccommodation,
  });
});

export const CO2eDtd = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  const emissionFactors = {
    mode: {
      Truck: 0.2, // kg CO2e/tonne-km
      Rail: 0.05, // kg CO2e/tonne-km
      Marine: 0.015, // kg CO2e/tonne-km
      Air: 0.6, // kg CO2e/tonne-km
    },
    spend: {
      Trucking: 0.05, // kg CO2e/USD
      Rail: 0.02, // kg CO2e/USD
    },
    fuel: {
      Diesel: 2.68, // kg CO2e/liter
      Gasoline: 2.31, // kg CO2e/liter
      "Natural Gas": 1.91, // kg CO2e/liter equivalent
      Propane: 1.53, // kg CO2e/liter
      Kerosene: 2.54, // kg CO2e/liter
    },
    electricity: {
      global_average: 0.475, // kg CO2e/kWh
      renewable: 0.05, // kg CO2e/kWh
      coal: 0.9, // kg CO2e/kWh
      natural_gas: 0.4, // kg CO2e/kWh
    },
  };

  const calculateCO2e = (entry) => {
    const {
      method,
      transportMode,
      massOfGoodsTransported,
      transportDistance,
      fuelConsumption,
      financialExpenditure,
      fuelType,
    } = entry;

    switch (method) {
      case "Fuel-based Method":
        console;
        return fuelConsumption * emissionFactors.fuel[fuelType];

      case "Distance-based Method":
        return (
          massOfGoodsTransported *
          transportDistance *
          emissionFactors.mode[transportMode]
        );

      case "Spend-based Method":
        return financialExpenditure * emissionFactors.spend[transportMode];

      default:
        throw new ApiError(400, "Invalid calculation method");
    }
  };

  const updatedDtdData = report.dtd.map((dtdEntry) => {
    // console.log("dtdEntry", dtdEntry);
    const CO2e = calculateCO2e(dtdEntry);
    return { ...dtdEntry, CO2e };
  });

  const updatedReport = await Report.findByIdAndUpdate(
    _id,
    { dtd: updatedDtdData },
    { new: true }
  );

  if (!updatedReport) {
    throw new ApiError(404, "Failed to update report accommodation data.");
  }

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: updatedReport,
  });
});

export const CO2eUtd = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;
  // console.log("req.body", req.body);
  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  const emissionFactors = {
    fuelTypes: {
      "Jet Fuel": 3.16, // kg CO2e/liter
      Diesel: 2.68, // kg CO2e/liter
      Gasoline: 2.31, // kg CO2e/liter
      Biodiesel: 2.5, // kg CO2e/liter
      Ethanol: 1.9, // kg CO2e/liter
      Hydrogen: 0, // Near-zero direct emissions
      "Natural Gas": 2.0, // kg CO2e/liter equivalen
    },
    electricityTypes: {
      "Natural Gas": 0.4, // kg CO2e/kWh
      "Grid Electricity": 0.475, // kg CO2e/kWh
      "Coal-based": 0.9, // kg CO2e/kWh
      Renewable: 0.05, // kg CO2e/kWh
      Nuclear: 0.012, // Very low kg CO2e/kWh
    },
    refrigerantTypes: {
      "R-410A": 2088, // Global Warming Potential
      "R-22": 1810,
      "R-134a": 1430,
      "R-404A": 3922,
    },
    transportModes: {
      Truck: 0.2, // kg CO2e/tonne-km
      Rail: 0.05, // kg CO2e/tonne-km
      Ship: 0.015, // kg CO2e/tonne-km
      Air: 0.6, // kg CO2e/tonne-km
    },
  };

  const calculateCO2e = (entry) => {
    const {
      method,
      fuelType,
      electricityType,
      refrigerantType,
      distance,

      totalMassTransported,
      cost,
      reportingCompanyMass,
    } = entry;

    let co2eEmissions = 0;

    switch (method) {
      case "Fuel-based Method":
        // Fuel consumption emissions
        const fuelEmissionFactor = emissionFactors.fuelTypes[fuelType] || 0;
        const fuelQuantity = parseFloat(distance) * 0.1; // Estimated fuel consumption
        const fuelAllocationRatio =
          parseFloat(reportingCompanyMass) / parseFloat(totalMassTransported);
        const fuelCO2e =
          fuelQuantity * fuelEmissionFactor * fuelAllocationRatio;

        // Electricity consumption emissions
        const electricityEmissionFactor =
          emissionFactors.electricityTypes[electricityType] || 0;
        const electricityConsumption = parseFloat(distance) * 0.05; // Estimated electricity consumption
        const electricityCO2e =
          electricityConsumption * electricityEmissionFactor;

        // Refrigerant leakage emissions
        const refrigerantGWP =
          emissionFactors.refrigerantTypes[refrigerantType] || 0;
        const refrigerantLeakage = 0.1; // Estimated refrigerant leakage
        const refrigerantCO2e = refrigerantLeakage * refrigerantGWP;

        co2eEmissions = fuelCO2e + electricityCO2e + refrigerantCO2e;
        break;

      case "Distance-based Method":
        const transportEmissionFactor =
          emissionFactors.transportModes[entry.transportMode] || 0;
        co2eEmissions =
          parseFloat(totalMassTransported) *
          parseFloat(distance) *
          transportEmissionFactor;
        break;

      case "Spend-based Method":
        const spendEmissionFactor = 0.05; // kg CO2e per dollar spent
        co2eEmissions = parseFloat(cost) * spendEmissionFactor;
        break;

      default:
        co2eEmissions = 0;
    }

    return co2eEmissions;
  };

  const updatedUtdData = report.utd.map((utdEntry) => {
    const CO2e = calculateCO2e(utdEntry);
    return { ...utdEntry, CO2e };
  });

  const updatedReport = await Report.findByIdAndUpdate(
    _id,
    { utd: updatedUtdData },
    { new: true }
  );

  if (!updatedReport) {
    throw new ApiError(404, "Failed to update report UTD data.");
  }
  // console.log("updatedReport", updatedReport);

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: updatedReport,
  });
});

// push to dev branch
export const CO2eUla = asyncHandler(async (req, res) => {
  const { _id, companyName } = req.body;

  if (!companyName || !_id) {
    throw new ApiError(400, "Company name and _id are required.");
  }

  const report = await Report.findById(_id);

  if (!report) {
    throw new ApiError(404, "Report not found.");
  }

  const calculateCO2e = (entry) => {
    const {
      method,
      companyArea,
      buildingTotalArea,
      occupancyRate,
      totalEnergyUse,
      leasedAssetArea,
      totalLesorAssetsArea,
      floorSpace,
      scope1Emissions,
      scope2Emissions,
    } = entry;

    let co2eEmissions = 0;

    switch (method) {
      case "Asset-specific Method":
        // Scope 1 and Scope 2 emissions for each leased asset
        const scope1 = parseFloat(scope1Emissions) || 0;
        const scope2 = parseFloat(scope2Emissions) || 0;

        // Energy allocation for buildings without sub-meters
        const energyAllocation =
          (parseFloat(companyArea) /
            (parseFloat(buildingTotalArea) * parseFloat(occupancyRate))) *
          parseFloat(totalEnergyUse);

        co2eEmissions = scope1 + scope2 + energyAllocation;
        break;

      case "Lessor-specific Method":
        // Collect lessor's scope 1 and scope 2 emissions
        const lessorScope1 = parseFloat(scope1Emissions) || 0;
        const lessorScope2 = parseFloat(scope2Emissions) || 0;

        // Apply allocation factor
        const allocationFactor =
          parseFloat(leasedAssetArea) / parseFloat(totalLesorAssetsArea);

        co2eEmissions =
          (lessorScope1 + lessorScope2 + parseFloat(totalEnergyUse)) *
          allocationFactor;
        break;

      case "Average-data Method":
        // Emissions based on floor space and average emission factor
        const averageEmissionFactor = 0.05; // kg CO2e per square meter
        co2eEmissions = parseFloat(floorSpace) * averageEmissionFactor;
        break;

      default:
        co2eEmissions = 0;
    }

    return co2eEmissions;
  };

  const updatedUlaData = report.ula.map((ulaEntry) => {
    const CO2e = calculateCO2e(ulaEntry);
    return { ...ulaEntry, CO2e };
  });

  const updatedReport = await Report.findByIdAndUpdate(
    _id,
    { ula: updatedUlaData },
    { new: true }
  );

  if (!updatedReport) {
    throw new ApiError(404, "Failed to update report ULA data.");
  }

  res.status(200).json({
    success: true,
    message: "CO2e calculated successfully",
    data: updatedReport,
  });
});
