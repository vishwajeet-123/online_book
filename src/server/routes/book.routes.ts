import express from "express";
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from "../controllers/book.controller.ts";
import { protect, authorize } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Admin only routes
router.post("/", protect, authorize("ADMIN"), createBook);
router.put("/:id", protect, authorize("ADMIN"), updateBook);
router.delete("/:id", protect, authorize("ADMIN"), deleteBook);

export default router;
