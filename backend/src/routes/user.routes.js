import { Router } from "express";
import {
  deleteUserPermission,
  getCompanyUsers,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserPermission,
  verifyToken,
  uploadLogo,
  hasSeenTour,
} from "../controllers/user.controller.js";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// User Routes
router
  .route("/register")
  .post(verifyJWT, restrictTo("SuperUser", "FacAdmin", "Admin"), registerUser);
router.route("/login").post(loginUser);
router.route("/verify-token").get(verifyToken);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/uploadLogo").post(verifyJWT, uploadLogo);
router.route("/hasSeenTour").post(hasSeenTour);

router.route("/getCompanyUsers").get(verifyJWT, getCompanyUsers);
router.route("/updateUserPermission").patch(verifyJWT, updateUserPermission);
router.route("/deleteUserPermission").delete(verifyJWT, deleteUserPermission);

router.route("/refresh-token").post(refreshAccessToken);


export default router;
