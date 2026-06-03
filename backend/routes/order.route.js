import express from "express";
import { createOrderController, getOrdersController } from "../controllers/order.controller.js";

const router = express.Router(); 

router.post("/", createOrderController)
router.get("/", getOrdersController)

export default router