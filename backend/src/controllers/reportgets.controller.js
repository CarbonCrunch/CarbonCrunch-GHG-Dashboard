import { Report } from "../models/report.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getDateRange = async (req, res) => {
  try {
    const { reportId, startDate, endDate } = req.query;

    const query = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (reportId) {
      query.reportId = reportId;
    }

    const reports = await Report.find(query);
    res.json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};


export const getFuelReport = asyncHandler(async (req, res) => {
    const { reportID } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 'CNG': 0.44, 'LNG': 1.16, 'LPG': 1.56, 'Natural gas': 2.02, 'Natural gas (100% mineral blend)': 2.03, 'Other petroleum gas': 0.94, 'Aviation spirit': 2.33, 'Aviation turbine fuel': 2.55, 'Burning oil': 2.54, 'Diesel (average biofuel blend)': 2.51, 'Diesel (100% mineral diesel)': 2.71, 'Fuel oil': 3.18, 'Gas oil': 2.76, 'Lubricants': 2.75, 'Naphtha': 2.12, 'Petrol (average biofuel blend)': 2.19, 'Petrol (100% mineral petrol)': 2.34, 'Processed fuel oils - residual oil': 3.18, 'Processed fuel oils - distillate oil': 2.76, 'Waste oils': 2.75, 'Marine gas oil': 2.78, 'Marine fuel oil': 3.11, 'Coal (industrial)': 2403.84, 'Coal (electricity generation)': 2252.34, 'Coal (domestic)': 2883.26, 'Coking coal': 3165.24, 'Petroleum coke': 3386.86, 'Coal (electricity generation - home produced)': 2248.82 };
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportID });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.fuel;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});


export const getBiogasReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 'Bioethanol': 0.01, 'Biodiesel ME': 0.17, 'Biodiesel ME (from used cooking oil)': 0.17, 'Biodiesel ME (from tallow)': 0.17, 'Wood logs': 61.82, 'Wood chips': 57.15, 'Wood pellets': 72.62, 'Grass/straw': 49.24, 'Biogas': 1.22, 'Landfill gas': 0.69 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.bioenergy;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});


export const getRefrigerantsReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 'Carbon dioxide': 1, 'Methane': 25, 'Nitrous oxide': 298, 'HFC-23': 14800, 'HFC-32': 675, 'HFC-41': 92, 'HFC-125': 3500, 'HFC-134': 1100, 'HFC-134a': 1430, 'HFC-143': 353, 'HFC-143a': 4470, 'HFC-152a': 124, 'HFC-227ea': 3220, 'HFC-236fa': 9810, 'HFC-245fa': 1030, 'HFC-43-I0mee': 1640, 'Perfluoromethane (PFC-14)': 7390, 'Perfluoroethane (PFC-116)': 12200, 'Perfluoropropane (PFC-218)': 8830, 'Perfluorocyclobutane (PFC-318)': 10300, 'Perfluorobutane (PFC-3-1-10)': 8860, 'Perfluoropentane (PFC-4-1-12)': 9160, 'Perfluorohexane (PFC-5-1-14)': 9300, 'Sulphur hexafluoride (SF6)': 22800, 'HFC-152': 53, 'HFC-161': 12, 'HFC-236cb': 1340, 'HFC-236ea': 1370, 'HFC-245ca': 693, 'HFC-365mfc': 794, 'R404A': 3922, 'R407A': 2107, 'R407C': 1774, 'R407F': 1825, 'R408A': 3152, 'R410A': 2088, 'R507A': 3985, 'R508B': 13396, 'R403A': 3124, 'CFC-11/R11 = trichlorofluoromethane': 4750, 'CFC-12/R12 = dichlorodifluoromethane': 10900, 'CFC-13': 14400, 'CFC-113': 6130, 'CFC-114': 10000, 'CFC-115': 7370, 'Halon-1211': 1890, 'Halon-1301': 7140, 'Halon-2402': 1640, 'Carbon tetrachloride': 1400, 'Methyl bromide': 5, 'Methyl chloroform': 146, 'HCFC-22/R22 = chlorodifluoromethane': 1810, 'HCFC-123': 77, 'HCFC-124': 609, 'HCFC-141b': 725, 'HCFC-142b': 2310, 'HCFC-225ca': 122, 'HCFC-225cb': 595, 'HCFC-21': 151, 'Nitrogen trifluoride': 17200, 'PFC-9-1-18': 7500, 'Trifluoromethyl sulphur pentafluoride': 17700, 'Perfluorocyclopropane': 17340, 'HFE-125': 14900, 'HFE-134': 6320, 'HFE-143a': 756, 'HCFE-235da2': 350, 'HFE-245cb2': 708, 'HFE-245fa2': 659, 'HFE-254cb2': 359, 'HFE-347mcc3': 575, 'HFE-347pcf2': 580, 'HFE-356pcc3': 110, 'HFE-449sl (HFE-7100)': 297, 'HFE-569sf2 (HFE-7200)': 59, 'HFE-43-10pccc124 (H-Galden1040x)': 1870, 'HFE-236ca12 (HG-10)': 2800, 'HFE-338pcc13 (HG-01)': 1500, 'PFPMIE': 10300, 'Dimethylether': 1, 'Methylene chloride': 9, 'Methyl chloride': 13, 'R290 = propane': 3, 'R600A = isobutane': 3, 'R406A': 1943, 'R409A': 1585, 'R502': 4657 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.refrigerants;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getEhtdcReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 'Carbon dioxide': 1, 'Methane': 25, 'Nitrous oxide': 298, 'HFC-23': 14800, 'HFC-32': 675, 'HFC-41': 92, 'HFC-125': 3500, 'HFC-134': 1100, 'HFC-134a': 1430, 'HFC-143': 353, 'HFC-143a': 4470, 'HFC-152a': 124, 'HFC-227ea': 3220, 'HFC-236fa': 9810, 'HFC-245fa': 1030, 'HFC-43-I0mee': 1640, 'Perfluoromethane (PFC-14)': 7390, 'Perfluoroethane (PFC-116)': 12200, 'Perfluoropropane (PFC-218)': 8830, 'Perfluorocyclobutane (PFC-318)': 10300, 'Perfluorobutane (PFC-3-1-10)': 8860, 'Perfluoropentane (PFC-4-1-12)': 9160, 'Perfluorohexane (PFC-5-1-14)': 9300, 'Sulphur hexafluoride (SF6)': 22800, 'HFC-152': 53, 'HFC-161': 12, 'HFC-236cb': 1340, 'HFC-236ea': 1370, 'HFC-245ca': 693, 'HFC-365mfc': 794, 'R404A': 3922, 'R407A': 2107, 'R407C': 1774, 'R407F': 1825, 'R408A': 3152, 'R410A': 2088, 'R507A': 3985, 'R508B': 13396, 'R403A': 3124, 'CFC-11/R11 = trichlorofluoromethane': 4750, 'CFC-12/R12 = dichlorodifluoromethane': 10900, 'CFC-13': 14400, 'CFC-113': 6130, 'CFC-114': 10000, 'CFC-115': 7370, 'Halon-1211': 1890, 'Halon-1301': 7140, 'Halon-2402': 1640, 'Carbon tetrachloride': 1400, 'Methyl bromide': 5, 'Methyl chloroform': 146, 'HCFC-22/R22 = chlorodifluoromethane': 1810, 'HCFC-123': 77, 'HCFC-124': 609, 'HCFC-141b': 725, 'HCFC-142b': 2310, 'HCFC-225ca': 122, 'HCFC-225cb': 595, 'HCFC-21': 151, 'Nitrogen trifluoride': 17200, 'PFC-9-1-18': 7500, 'Trifluoromethyl sulphur pentafluoride': 17700, 'Perfluorocyclopropane': 17340, 'HFE-125': 14900, 'HFE-134': 6320, 'HFE-143a': 756, 'HCFE-235da2': 350, 'HFE-245cb2': 708, 'HFE-245fa2': 659, 'HFE-254cb2': 359, 'HFE-347mcc3': 575, 'HFE-347pcf2': 580, 'HFE-356pcc3': 110, 'HFE-449sl (HFE-7100)': 297, 'HFE-569sf2 (HFE-7200)': 59, 'HFE-43-10pccc124 (H-Galden1040x)': 1870, 'HFE-236ca12 (HG-10)': 2800, 'HFE-338pcc13 (HG-01)': 1500, 'PFPMIE': 10300, 'Dimethylether': 1, 'Methylene chloride': 9, 'Methyl chloride': 13, 'R290 = propane': 3, 'R600A = isobutane': 3, 'R406A': 1943, 'R409A': 1585, 'R502': 4657 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.ehctd;
        let electricityGEF = 0;
        let electricityTD = 0;
        let heatingGEF = 0;
        let heatingTD = 0;
        let coolingGEF = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                if (value[0] === 'Electricity') {
                    electricityGEF = electricityGEF + (0.6077 * value[1]);
                    electricityTD = electricityTD + (0.0188 * value[1]);
                }
                if (value[0] === 'Heating* and Steam') {
                    heatingGEF = heatingGEF + (0.1707 * value[1]);
                    heatingTD = heatingTD + (0.009 * value[1]);
                }
                if (value[0] === 'District Cooling') {
                    coolingGEF = coolingGEF + (0.5469 * value[1]);
                }
            }
        });

        res.json({
            "electricityGEF": electricityGEF,
            "electricityTD": electricityTD,
            "heatingGEF": heatingGEF,
            "heatingTD": heatingTD,
            "coolingGEF": coolingGEF,
        });


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});


export const getWttReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 'Butane': 0.19686, 'CNG': 0.09487, 'LNG': 0.39925, 'LPG': 0.18383, 'Natural Gas': 0.34593, 'Other Petroleum Gas': 0.11154, 'Propane': 0.18046, 'Aviation Spirit': 0.59512, 'Aviation Turbine Fuel': 0.52686, 'Burning Oil': 0.52807, 'Diesel (average biofuel blend)': 0.60986, 'Diesel (100% mineral diesel)': 0.62874, 'Fuel Oil': 0.69723, 'Gas Oil': 0.63253, 'Lubricants': 0, 'Naphtha': 0, 'Petrol (average biofuel blend)': 0.61328, 'Petrol (100% mineral petrol)': 0.60283, 'Processed fuel oils - residual oil': 0.82185, 'Processed fuel oils - distillate oil': 0.70791, 'Refinery Miscellaneous': 0, 'Waste oils': 0, 'Marine gas oil': 0.63253, 'Marine fuel oil': 0.69723, 'Natural gas (100% mineral blend)': 0.34593 }

    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.wttfuel;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});



export const getMaterialReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 'Aggregates': 7.76, 'Average construction': 79.97, 'Asbestos': 27.0, 'Asphalt': 39.21, 'Bricks': 241.76, 'Concrete': 131.76, 'Insulation': 1861.76, 'Metals': 3975.82, 'Mineral oil': 1401.0, 'Plasterboard': 120.05, 'Tyres': 3335.57, 'Wood': 312.61, 'Glass': 1402.77, 'Clothing': 22310.0, 'Food and drink': 3701.4, 'Compost derived from garden waste': 113.31, 'Compost derived from food and garden waste': 116.13, 'Electrical items - fridges and freezers': 4363.33, 'Electrical items - large': 3267.0, 'Electrical items - IT': 24865.48, 'Electrical items - small': 5647.95, 'Batteries - Alkaline': 4633.48, 'Batteries - Li ion': 6308.0, 'Batteries - NiMh': 28380.0, 'Metal: aluminium cans and foil (excl. forming)': 9122.64, 'Metal: mixed cans': 5268.56, 'Metal: scrap metal': 3682.68, 'Metal: steel cans': 3100.64, 'Plastics: average plastics': 3116.29, 'Plastics: average plastic film': 2574.16, 'Plastics: average plastic rigid': 3276.71, 'Plastics: HDPE (incl. forming)': 3269.84, 'Plastics: LDPE and LLDPE (incl. forming)': 2600.64, 'Plastics: PET (incl. forming)': 4032.39, 'Plastics: PP (incl. forming)': 3104.73, 'Plastics: PS (incl. forming)': 3777.95, 'Plastics: PVC (incl. forming)': 3413.08, 'Paper and board: board': 821.23, 'Paper and board: mixed': 881.19, 'Paper and board: paper': 919.4 }

    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.material;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getWasteReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 'Aggregates': 1.24, 'Average construction': 0, 'Asbestos': 5.92, 'Asphalt': 1.24, 'Bricks': 1.24, 'Concrete': 1.24, 'Insulation': 1.24, 'Metals': 1.26, 'Soils': 17.58, 'Mineral oil': 0, 'Plasterboard': 71.95, 'Tyres': 0, 'Wood': 828.03, 'Books': 1041.8, 'Glass': 8.9, 'Clothing': 444.94, 'Household residual waste': 446.24, 'Organic: food and drink waste': 626.87, 'Organic: garden waste': 578.96, 'Organic: mixed food and garden waste': 587.34, 'Commercial and industrial waste': 467.05, 'WEEE - fridges and freezers': 8.9, 'WEEE - large': 8.9, 'WEEE - mixed': 8.9, 'WEEE - small': 8.9, 'Batteries': 8.9, 'Metal: aluminium cans and foil (excl. forming)': 8.9, 'Metal: mixed cans': 8.9, 'Metal: scrap metal': 8.9, 'Metal: steel cans': 8.9, 'Plastics: average plastics': 8.9, 'Plastics: average plastic film': 8.9, 'Plastics: average plastic rigid': 8.9, 'Plastics: HDPE (incl. forming)': 8.9, 'Plastics: LDPE and LLDPE (incl. forming)': 8.9, 'Plastics: PET (incl. forming)': 8.9, 'Plastics: PP (incl. forming)': 8.9, 'Plastics: PS (incl. forming)': 8.9, 'Plastics: PVC (incl. forming)': 8.9, 'Paper and board: board': 1041.8, 'Paper and board: mixed': 1041.8, 'Paper and board: paper': 1041.8 }

    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.waste;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];

            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getFaReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;

    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData1 = report.fa.hotelRows;
        const fuelData2 = report.fa.flightRows;
        let hotelTotalCO2e = 0;
        let flightTotalCO2e = 0;

        fuelData1.forEach((value) => {
            let valueDate = new Date(value.date);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                hotelTotalCO2e += 93.2 * value.room * value.night;
            }
        });

        fuelData2.forEach((value) => {
            let valueDate = new Date(value.date);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                flightTotalCO2e += value.CO2e;
            }
        });

        res.json({ hotelTotalCO2e, flightTotalCO2e });


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getFgReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 3001: 0.81, 3002: 1.07, 3003: 0, 3004: 0, 3005: 0, 3006: 0, 3007: 0.19, 3008: 0.63, 3009: 0.72, 3010: 0, 3011: 0, 3012: 0, 3013: 0, 3014: 0.25, 3015: 0.59, 3016: 0.78, 3017: 0, 3018: 0, 3019: 0, 3020: 0, 3021: 0.23, 3022: 0.6, 3023: 0.72, 3024: 0.62, 3025: 0.68, 3026: 0.61, 3027: 0, 3028: 0.25, 3029: 0.49, 3030: 0.34, 3031: 0.18, 3032: 0.21, 3033: 0.13, 3034: 0.08, 3035: 0.08, 3036: 0.11, 3037: 0.58, 3038: 0.4, 3039: 0.22, 3040: 0.25, 3041: 0.15, 3042: 0.09, 3043: 0.09, 3044: 0.13, 3045: 4.49, 3046: 2.38, 3047: 2.3, 3048: 1.22, 3049: 1.02, 3050: 0.54, 3051: 1.02, 3052: 0.54, 3053: 0.03, 3054: 0.0, 3055: 0.0, 3056: 0.01, 3057: 0.01, 3058: 0.01, 3059: 0.03, 3060: 0.0, 3061: 0.01, 3062: 0.01, 3063: 0.02, 3064: 0.03, 3065: 0.05, 3066: 0.01, 3067: 0.01, 3068: 0.01, 3069: 0.02, 3070: 0.02, 3071: 0.01, 3072: 0.01, 3073: 0.01, 3074: 0.01, 3075: 0.01, 3076: 0.04, 3077: 0.01, 3078: 0.0, 3079: 0.0, 3080: 0.0, 3081: 0.01, 3082: 0.01, 3083: 0.03, 3084: 0.0, 3085: 0.01, 3086: 0.02, 3087: 0.01, 3088: 0.01, 3089: 0.02, 3090: 0.02, 3091: 0.01, 3092: 0.01, 3093: 0.02, 3094: 0.02, 3095: 0.02, 3096: 0.03, 3097: 0.04, 3098: 0.02, 3099: 0.03, 3100: 0.06, 3101: 0.04, 3102: 0.05, 3103: 0.06, 3104: 0.05, 3105: 0.38, 3106: 0.01 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.fg;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * value[3] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});



export const getEcReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 3001: 0.05, 3002: 0.05, 3003: 0.06, 3004: 0.05, 3005: 0, 3006: 0.16, 3007: 0.24, 3008: 0.18, 3009: 0.14, 3010: 0.16, 3011: 0.21, 3012: 0.17, 3013: 0.1, 3014: 0.11, 3015: 0.15, 3016: 0.12, 3017: 0, 3018: 0.18, 3019: 0.27, 3020: 0.2, 3021: 0.15, 3022: 0.19, 3023: 0.28, 3024: 0.17, 3025: 0.06, 3026: 0.09, 3027: 0.1, 3028: 0.1, 3029: 0.15, 3030: 0.18, 3031: 0.23, 3032: 0.17, 3033: 0.02, 3034: 0.13, 3035: 0.11, 3036: 0.08, 3037: 0.1, 3038: 0.13, 3039: 0.11, 3040: 0.21, 3041: 0.15, 3042: 0.31, 3043: 0.2, 3044: 0.12, 3045: 0.08, 3046: 0.1, 3047: 0.03, 3048: 0.04, 3049: 0.0, 3050: 0.03, 3051: 0.03 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.ec;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getFoodReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { '1 standard breakfast': 0.84, '1 gourmet breakfast': 2.33, '1 cold or hot snack': 2.02, '1 average meal': 4.7, 'Non-alcoholic beverage': 0.2, 'Alcoholic beverage': 1.87, '1 hot snack (burger + fries)': 2.77, '1 sandwich': 1.27, 'Meal, vegan': 1.69, 'Meal, vegetarian': 2.85, 'Meal, with beef': 6.93, 'Meal, with chicken': 3.39 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.food;
        let total = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                total += value[1] * conversionRates[value[0]];
            }
        });

        res.json(total);


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getHomeOfficeReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.homeOffice;
        let withHeating = 0;
        let withCooling = 0;
        let noHeatingCooling = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[5]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                if (value[0] === 4001) {
                    withHeating += (value[1] * (value[2] / 100) * (value[3] / 100) * 5.15 * 0.61 * value[4]);
                }

                if (value[0] === 4002) {
                    withCooling += (value[1] * (value[2] / 100) * (value[3] / 100) * 3.65 * 0.61 * value[4]);
                }
                if (value[0] === 4003) {
                    noHeatingCooling += (value[1] * (value[2] / 100) * (value[3] / 100) * 0.15 * 0.61 * value[4]);
                }
            }
        });

        res.json({
            "total": withHeating + withCooling + noHeatingCooling,
            "withHeating": withHeating,
            "withCooling": withCooling,
            "noHeatingCooling": noHeatingCooling,
        });


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getWaterReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.water;
        let supplyCO2e = 0;
        let treatmentCO2e = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                if (value[0] === "Water Supply") {
                    supplyCO2e += 0.149 * value[1];
                }

                if (value[0] === 4002) {
                    treatmentCO2e += 0.149 * value[1];
                }

            }
        });

        res.json({
            "total": supplyCO2e + treatmentCO2e,
            "supplyCO2e": supplyCO2e,
            "treatmentCO2e": treatmentCO2e,
        });


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});

export const getFuelMonthReport = asyncHandler(async (req, res) => {
    const { reportId , datatype } = req.params;
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report[datatype];
        const monthWiseTotals = {};

        fuelData.forEach(fuel => {
            const [fuelType, quantity, dateStr] = fuel;
            const date = new Date(dateStr);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!monthWiseTotals[yearMonth]) {
                monthWiseTotals[yearMonth] = 0;
            }

            monthWiseTotals[yearMonth] += quantity;
        });

        const dataa = []
        for (const [yearMonth, total] of Object.entries(monthWiseTotals)) {
            dataa.push({yearMonth, total});
        }

        res.json(dataa);



    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});








export const getBTLSReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 6001: 0.05, 6002: 0.05, 6003: 0.06, 6004: 0.05, 6005: 0, 6006: 0.16, 6007: 0.24, 6008: 0.18, 6009: 0.14, 6010: 0.16, 6011: 0.21, 6012: 0.17, 6013: 0.1, 6014: 0.11, 6015: 0.15, 6016: 0.12, 6017: 0, 6018: 0.18, 6019: 0.27, 6020: 0.2, 6021: 0.15, 6022: 0.19, 6023: 0.28, 6024: 0.17, 6025: 0.06, 6026: 0.09, 6027: 0.1, 6028: 0.1, 6029: 0.15, 6030: 0.18, 6031: 0.23, 6032: 0.17, 6033: 0.02, 6034: 0.13, 6035: 0.11, 6036: 0.08, 6037: 0.1, 6038: 0.13, 6039: 0.11, 6040: 0.21, 6041: 0.15, 6042: 0.31, 6043: 0.2, 6044: 0.12, 6045: 0.08, 6046: 0.1, 6047: 0.03, 6048: 0.04, 6049: 0.0, 6050: 0.03, 6051: 0.03 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.btls;
        let landtotal = 0;
        let seatotal = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                if (value[0] === 6033 || value[0] === 6034 || value[0] === 6035) {
                    seatotal += value[1] * conversionRates[value[0]];
                }

                else {
                    landtotal += value[1] * conversionRates[value[0]];
                }

            }
        });

        res.json({
            "total": landtotal + seatotal,
            "landtotal": landtotal,
            "seatotal": seatotal
        });


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});


export const getOVReport = asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    const { specificDate } = req.params;
    const conversionRates = { 6001: 0.05, 6002: 0.05, 6003: 0.06, 6004: 0.05, 6005: 0, 6006: 0.16, 6007: 0.24, 6008: 0.18, 6009: 0.14, 6010: 0.16, 6011: 0.21, 6012: 0.17, 6013: 0.1, 6014: 0.11, 6015: 0.15, 6016: 0.12, 6017: 0, 6018: 0.18, 6019: 0.27, 6020: 0.2, 6021: 0.15, 6022: 0.19, 6023: 0.28, 6024: 0.17, 6025: 0.06, 6026: 0.09, 6027: 0.1, 6028: 0.1, 6029: 0.15, 6030: 0.18, 6031: 0.23, 6032: 0.17, 6033: 0.02, 6034: 0.13, 6035: 0.11, 6036: 0.08, 6037: 0.1, 6038: 0.13, 6039: 0.11, 6040: 0.21, 6041: 0.15, 6042: 0.31, 6043: 0.2, 6044: 0.12, 6045: 0.08, 6046: 0.1, 6047: 0.03, 6048: 0.04, 6049: 0.0, 6050: 0.03, 6051: 0.03 }
    // const specificDate = new Date('2024-07-09');
    try {
        const report = await Report.findOne({ reportId: reportId });
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        const fuelData = report.btls;
        let passengerFactorFuel = 0;
        let deliveryFactorFuel = 0;

        fuelData.forEach((value) => {
            let valueDate = new Date(value[2]);
            let specificDateObj = new Date(specificDate);
            if (valueDate <= specificDateObj) {
                if (value[0] === 6033 || value[0] === 6034 || value[0] === 6035) {
                    seatotal += value[1] * conversionRates[value[0]];
                }

                else {
                    landtotal += value[1] * conversionRates[value[0]];
                }

            }
        });

        res.json({
            "total": passengerFactorFuel + deliveryFactorFuel,
            "landtotal": passengerFactorFuel,
            "seatotal": deliveryFactorFuel
        });


    } catch (error) {
        console.error('Error fetching user reports:', error);
        throw new ApiError(500, 'Something went wrong while fetching user reports.');
    }
});