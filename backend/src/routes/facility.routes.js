import { Router } from "express";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createNewFacility,
  createPermission,
  deleteCompanyFacilities,
  getCompanyFacilities,
} from "../controllers/facility.controller.js";

const router = Router();

// Facility Routes
router
  .route("/createFacility")
  .post(
    verifyJWT,
    restrictTo("SuperUser", "FacAdmin", "Admin"),
    createNewFacility
  );
router
  .route("/createPermission")
  .post(
    verifyJWT,
    restrictTo("SuperUser", "FacAdmin", "Admin"),
    createPermission
  );
router
  .route("/getCompanyFacilities")
  .get(
    verifyJWT,
    restrictTo("SuperUser", "FacAdmin", "Admin"),
    getCompanyFacilities
  );

router
  .route("/deleteCompanyFacilities")
  .delete(
    verifyJWT,
    restrictTo("SuperUser", "FacAdmin", "Admin"),
    deleteCompanyFacilities
  );

export default router;
