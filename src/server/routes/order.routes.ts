import express from "express";
import { placeOrder, getOrderHistory, getAllOrders } from "../controllers/order.controller.ts";
import { protect, authorize } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/history", protect, getOrderHistory);
router.get("/all", protect, authorize("ADMIN"), getAllOrders);

export default router;
