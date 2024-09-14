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
    origin: "http://localhost:5173",
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

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

export { app };
