import { Router } from "express";
import { verifyJWT, restrictTo } from "../middlewares/auth.middleware.js";
import {
  createBills,
  getBills,
  getCompanyBill,
  updateBill,
} from "../controllers/bill.controller.js";

const router = Router();

router
  .route("/getBills", verifyJWT, restrictTo("FacAdmin", "Admin"))
  .get(getBills);
router
  .route("/getCompanyBill")
  .get(verifyJWT, restrictTo("Admin"), getCompanyBill);
router
  .route("/createBills", verifyJWT, restrictTo("FacAdmin", "Admin"))
  .post(createBills);

router
  .route("/:billId/put")
  .patch(verifyJWT, restrictTo("SuperUser"), updateBill);

export default router;
