import express from "express";
import { getRouteForCar } from "../controllers/route.controller.js";
import { getMetricsFromRoute } from "../services/routeEvaluator.service.js";

const router = express.Router();

router.post("/route", getRouteForCar);
router.post("/metrics", getMetricsFromRoute)

export default router;
