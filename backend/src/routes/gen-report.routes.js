import { Router } from "express";
import { createNewReport } from "../controllers/generate-report.controller.js";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/createNewReport")
  .post(verifyJWT, restrictTo("FacAdmin", "Admin"), createNewReport);

export default router;
