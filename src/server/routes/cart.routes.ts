import express from "express";
import { protect } from "../middleware/auth.middleware.ts";

const router = express.Router();

// Simplifying: Cart will be managed localstorage mostly, 
// but we provide endpoints for persistent cart if needed.
router.get("/", protect, (req, res) => {
  res.json({ message: "Cart functionality active" });
});

export default router;
