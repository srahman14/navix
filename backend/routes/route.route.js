import express from "express";
import { getRouteForCar } from "../controllers/route.controller.js";

const router = express.Router();

router.post("/route", getRouteForCar);

export default router;
