import express from "express";
import { getMetrics } from "../controllers/evaluator.controller.js";
import { getLocationDetails } from "../controllers/reverseGeocode.controller.js";
import { getRouteForProfile, getScoreForRoute } from "../controllers/route.controller.js";

const router = express.Router();

router.post("/route", getRouteForProfile);
router.post("/score", getScoreForRoute);
router.post("/metrics", getMetrics)
router.post("/geocode", getLocationDetails)

export default router;
