import { Router } from "express";
import {
  changeCurrentTab,
  createNewReport,
  deleteReport,
  getCurrentTab,
  getReport,
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
  updateWasteDisposalData,
  updateWaterData,
  updateWTTFuelData,
} from "../controllers/report.controller.js";
import { verifyJWT, restrictTo } from "../middlewares/auth.middleware.js";
import {
  getBiogasReport,
  getBTLSReport,
  getEcReport,
  getEhtdcReport,
  getFaReport,
  getFgReport,
  getFoodReport,
  getFuelMonthReport,
  getFuelReport,
  getHomeOfficeReport,
  getRefrigerantsReport,
  getWasteReport,
  getWaterReport,
  getWttReport,
  getDateRange,
} from "../controllers/reportgets.controller.js";
const router = Router();

router
.route("/create")
.post(verifyJWT, restrictTo("FacAdmin", "Admin"), createNewReport);
router
.route("/get")
.get(verifyJWT, getUserReports);
router
  .route("/:reportId/delete")
  .delete(verifyJWT , deleteReport);

router.route("/:reportId/get").get(getReport);

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

router
  .route("/:reportId/tab/change")
  .patch(verifyJWT, restrictTo("FacAdmin", "Admin"), changeCurrentTab);

router
  .route("/:reportId/tab/get")
  .get(verifyJWT, restrictTo("FacAdmin", "Admin"), getCurrentTab);


// date wise data getting

router.route("/:reportId/getFuel/:specificDate").get(getFuelReport);
router.route("/:reportId/getBiogas/:specificDate").get(getBiogasReport);
router
  .route("/:reportId/getRefrigerants/:specificDate")
  .get(getRefrigerantsReport);
router.route("/:reportId/getEhtdc/:specificDate").get(getEhtdcReport);
//owned vechical skipped
router.route("/:reportId/getWtt/:specificDate").get(getWttReport);
router.route("/:reportId/getMaterial/:specificDate").get(getWttReport);
router.route("/:reportId/getWaste/:specificDate").get(getWasteReport);
router.route("/:reportId/getFa/:specificDate").get(getFaReport);
router.route("/:reportId/getBTLS/:specificDate").get(getBTLSReport);
router.route("/:reportId/getFg/:specificDate").get(getFgReport);
router.route("/:reportId/getEc/:specificDate").get(getEcReport);
router.route("/:reportId/getFood/:specificDate").get(getFoodReport);
router.route("/:reportId/getHomeOfiice/:specificDate").get(getHomeOfficeReport);
router.route("/:reportId/getWater/:specificDate").get(getWaterReport);
router.route("/:reportId/getFuelReport/:datatype").get(getFuelMonthReport);
router.route("/:reportId/dateRange").get(getDateRange);

//  food, ec btls waste material wtt ov refrigents bioenergy ehctd water fuel
// fg homeoffice
// fa

export default router;
