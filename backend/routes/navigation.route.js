import express from "express";
import { getMetrics } from "../controllers/evaluator.controller.js";
import { getRouteForProfile } from "../controllers/route.controller.js";
import { getLocationDetails } from "../controllers/reverseGeocode.controller.js";
import { createRouteInfoController, getRouteInfoController } from "../controllers/routeInfo.controller.js";

const router = express.Router();

router.post("/route", getRouteForProfile);
router.post("/metrics", getMetrics)
router.post("/geocode", getLocationDetails)
router.post("/routeInfo", createRouteInfoController)
router.get("/routeInfo", getRouteInfoController)

export default router;
