// routes/adminRoutes.js
import express from "express";
import { getRiders } from "../controllers/adminController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

// Admin-only route to get all riders
router.get("/riders", isAuthenticated, isAdmin, getRiders);

export default router;