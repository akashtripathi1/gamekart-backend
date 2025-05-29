import express from "express";
import passport from "passport";
import { isAuthenticated } from "../middlewares/authorizeMiddleware.js";
import {
  handleGoogleCallback,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    callbackURL: "/api/auth/google/callback",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  handleGoogleCallback
);

router.get("/current_user", isAuthenticated, getCurrentUser);
router.get("/logout", logout);

export default router;
