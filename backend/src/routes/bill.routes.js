import { Router } from "express";
import { verifyJWT, restrictTo } from "../middlewares/auth.middleware.js";
import { createBills, getBills } from "../controllers/bill.controller.js";

const router = Router();

router.route('/getBills',verifyJWT, restrictTo('FacAdmin', 'Admin')).get(getBills);
router
  .route("/createBills", verifyJWT, restrictTo("FacAdmin", "Admin"))
  .post(createBills);




export default router;
