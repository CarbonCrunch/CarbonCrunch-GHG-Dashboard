import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import {fileURLToPath} from "url";
import path, {dirname, resolve} from "path";
import userRouter from "./routes/user.routes.js";
import reportRouter from "./routes/report.routes.js";
import billRouter from "./routes/bill.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
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
app.use("/api/bills", billRouter)

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

export {app};
