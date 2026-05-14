import express from "express";
import { sqlite as db } from "../database/db.sqlite.ts";
import { protect, authorize } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/stats", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const booksCount = db.prepare("SELECT COUNT(*) as count FROM books").get() as any;
    const orders = db.prepare("SELECT * FROM orders").all() as any[];
    const usersCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;

    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({
      totalBooks: booksCount.count,
      totalOrders: orders.length,
      totalUsers: usersCount.count,
      totalSales,
      recentOrders: orders.slice(-5).reverse().map(o => ({ ...o, items: JSON.parse(o.items) }))
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Error fetching dashboard stats" });
  }
});

router.get("/users", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all() as any[];
    const safeUsers = users.map(u => {
      delete u.password;
      return u;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;
