import { Router } from "express";
import { verifyJWT, restrictTo } from "../middlewares/auth.middleware.js";
import {
  addData,
  // changeCurrentTab,
  // getCurrentTab,
  deleteReport,
  getCompanyGenReports,
  getCompanyReport,
  getReportForTimeRange,
  getUserGenReports,
  getUserReports,
  updateBioenergyData,
  updateBTLSData,
  updateECData,
  updateEHCTDData,
  updateFAData,
  updateFGData,
  updateFoodData,
  updateFuelData,
  updateHomeOfficeData,
  updateMaterialUseData,
  updateOwnedVehiclesData,
  updateRefrigerantsData,
  updateDtdData,
  updateWasteDisposalData,
  updateWaterData,
  updateWTTFuelData,
  updateUtdData,
  updateUlaData,
} from "../controllers/report.controller.js";
import {
  CO2eOv,
  CO2eWttFuels,
  CO2eWaste,
  CO2eBioenergy,
  CO2eEhctd,
  CO2eFuel,
  CO2eMaterialUse,
  CO2eRefrigerants,
  CO2eBtls,
  CO2eFg,
  CO2eEc,
  CO2eFood,
  CO2eWater,
  CO2eHome,
  CO2eFa,
  CO2eDtd,
  CO2eUla,
  CO2eUtd,
} from "../controllers/factor.controller.js";
const router = Router();

router
  .route("/addData")
  .post(verifyJWT, restrictTo("FacAdmin", "Admin"), addData);


router.route("/getUserReports").post(getUserReports);
router.route("/getCompanyReport").post(getCompanyReport);
router.route("/getUserGenReports").post(getUserGenReports);
router.route("/getCompanyGenReports").post(getCompanyGenReports);
router.route("/getReportForTimeRange").post(getReportForTimeRange);

router
  .route("/:reportId/delete")
  .delete(verifyJWT, restrictTo("FacAdmin", "Admin"), deleteReport);

router
  .route("/:reportId/fuel/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateFuelData);
router
  .route("/:reportId/food/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateFoodData);
router
  .route("/:reportId/bioenergy/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateBioenergyData);
router
  .route("/:reportId/refrigerants/put")
  .patch(verifyJWT, updateRefrigerantsData);
router
  .route("/:reportId/ehctd/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateEHCTDData);
router
  .route("/:reportId/wtt-fuels/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateWTTFuelData);
router
  .route("/:reportId/material/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateMaterialUseData);
router
  .route("/:reportId/waste/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateWasteDisposalData);
router
  .route("/:reportId/btls/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateBTLSData);
router
  .route("/:reportId/ec/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateECData);
router
  .route("/:reportId/water/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateWaterData);
router
  .route("/:reportId/fg/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateFGData);
router
  .route("/:reportId/home-office/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateHomeOfficeData);
router
  .route("/:reportId/owned-vehicles/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateOwnedVehiclesData);
router
  .route("/:reportId/fa/put")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateFAData);
  router.route("/:reportId/dtd/put").patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateDtdData);
  router
    .route("/:reportId/utd/put")
    .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateUtdData);
  router
    .route("/:reportId/ula/put")
    .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), updateUlaData);

// routeru
//   .route("/:reportId/tab/change")
//   .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), changeCurrentTab);

// router
//   .route("/:reportId/tab/get")
//   .get(verifyJWT, restrictTo("FacAdmin", "Admin"), getCurrentTab);
router.route("/CO2eFuel").post(CO2eFuel);

router.route("/CO2eBioenergy").post(CO2eBioenergy);
router.route("/CO2eRefrigerants").post(CO2eRefrigerants);
router.route("/CO2eEhctd").post(CO2eEhctd);
router.route("/CO2eOv").post(CO2eOv);

router.route("/CO2eFa").post(CO2eFa);

router.route("/CO2eBtls").post(CO2eBtls);

router.route("/CO2eFg").post(CO2eFg);

router.route("/CO2eEc").post(CO2eEc);

router.route("/CO2eWTTFuel").post(CO2eWttFuels);
router.route("/CO2eFood").post(CO2eFood);

router.route("/CO2eMaterialsUsed").post(CO2eMaterialUse);

router.route("/CO2eWasteDisposal").post(CO2eWaste);

router.route("/CO2eHome").post(CO2eHome);

router.route("/CO2eWater").post(CO2eWater);
router.route("/CO2eDtd").post(CO2eDtd);
router.route("/CO2eUtd").post(CO2eUtd);
router.route("/CO2eUla").post(CO2eUla);


export default router;
