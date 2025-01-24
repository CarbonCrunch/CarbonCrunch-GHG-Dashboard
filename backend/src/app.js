import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import path, { dirname, resolve } from "path";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import userRouter from "./routes/user.routes.js";
import reportRouter from "./routes/report.routes.js";
import billRouter from "./routes/bill.routes.js";
import facilityRouter from "./routes/facility.routes.js";
import genReportRouter from "./routes/gen-report.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use(express.static(resolve(__dirname, "../../frontend/dist")));

app.use("/api", limiter);
app.use("/api/facilities", facilityRouter);
app.use("/api/users", userRouter);
app.use("/api/reports", reportRouter);
app.use("/api/bills", billRouter);
app.use("/api/gen-report", genReportRouter);


// Calculation endpoint
app.post('/api/calculate', (req, res) => {
  const { industry, employees, operationalDays, location, energyEfficiency = 0 } = req.body;

  // Input validation
  if (!industry || !employees || !operationalDays || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Step 1: Get industry average energy consumption per employee
  const industryAverages = {
    manufacturing: 20000, // kWh/employee/year
    services: 6000,
    retail: 4500,
    hospitality: 8000,
    // Add more industries as needed
  };

  const emissionFactors = {
    usa: 0.453, // kg CO₂e/kWh
    europe: 0.276,
    china: 0.681,
    // Add more locations as needed
  };

  const carbonTaxRates = {
    usa: 50, // $ per tonne CO₂e
    europe: 60,
    china: 30,
    // Add more locations as needed
  };

  // Get industry average
  const averageEnergyPerEmployee = industryAverages[industry];
  if (!averageEnergyPerEmployee) {
    return res.status(400).json({ error: 'Invalid industry selected' });
  }

  // Get emission factor
  const emissionFactor = emissionFactors[location];
  if (!emissionFactor) {
    return res.status(400).json({ error: 'Invalid location selected' });
  }

  // Get carbon tax rate
  const carbonTaxRate = carbonTaxRates[location];

  // Standard operational days
  const standardOperationalDays = 250;

  // Step 2: Calculate annual energy consumption
  let annualEnergyConsumption = employees * averageEnergyPerEmployee;
  annualEnergyConsumption *= operationalDays / standardOperationalDays;

  // Adjust for energy efficiency
  annualEnergyConsumption *= 1 - energyEfficiency;

  // Step 3: Calculate GHG emissions
  const ghgEmissions = (annualEnergyConsumption * emissionFactor) / 1000; // Convert kg to tonnes

  // Step 4: Calculate potential carbon tax liability
  const carbonTaxLiability = ghgEmissions * carbonTaxRate;

  // Step 5: Estimate total financial risk (simplified for this example)
  const totalFinancialRisk = carbonTaxLiability; // Add other risk factors as needed

  // Respond with results
  res.json({
    energyConsumption: Math.round(annualEnergyConsumption),
    ghgEmissions: ghgEmissions.toFixed(2),
    carbonTaxLiability: Math.round(carbonTaxLiability),
    totalFinancialRisk: Math.round(totalFinancialRisk),
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

export { app };
