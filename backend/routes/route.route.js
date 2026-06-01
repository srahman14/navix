import express from "express";
import { getMetrics } from "../controllers/evaluator.controller.js";
import { getRouteForCar } from "../controllers/route.controller.js";
import { getLocationDetails } from "../controllers/reverseGeocode.controller.js";

const router = express.Router();

router.post("/route", getRouteForCar);
router.post("/metrics", getMetrics)
router.post("/geocode", getLocationDetails)

export default router;
