import express from "express";
import { getMetrics } from "../controllers/evaluator.controller.js";
import { getLocationDetails } from "../controllers/reverseGeocode.controller.js";
import { getRouteForProfile, getRouteReport, getScoreForRoute } from "../controllers/route.controller.js";
import { getRouteExplanation } from "../controllers/explanation.controller.js";
import { getRouteDecision } from "../controllers/decision.controller.js";

const router = express.Router();

router.post("/route", getRouteForProfile);
router.post("/score", getScoreForRoute);
router.post("/metrics", getMetrics);
router.post("/geocode", getLocationDetails);
router.post("/report", getRouteReport);
router.post("/explanation", getRouteExplanation)
router.post("/decision", getRouteDecision);

export default router;
