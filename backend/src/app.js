import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {fileURLToPath} from "url";
import path, {dirname, resolve} from "path";
import userRouter from "./routes/user.routes.js";
import reportRouter from "./routes/report.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

app.use(express.static(resolve(__dirname, "../../frontend/dist")));

app.use("/api/users", userRouter);
app.use("/api/reports", reportRouter);

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

export {app};
