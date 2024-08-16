import {Router} from "express";
import {
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    verifyToken,
} from "../controllers/user.controller.js";
import { restrictTo, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(verifyJWT, restrictTo("SuperUser", "FacAdmin", "Admin"), registerUser);

router.route("/login").post(loginUser);
router.route("/verify-token").get(verifyToken);


router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;
