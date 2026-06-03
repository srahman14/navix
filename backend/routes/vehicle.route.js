import express from "express"
import { createVehicleController, getVehiclesController } from "../controllers/vehicle.controller.js";

const router = express.Router(); 

router.post("/", createVehicleController)
router.get("/", getVehiclesController)

export default router