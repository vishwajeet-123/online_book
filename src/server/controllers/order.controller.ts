import { sqlite as db } from "../database/db.sqlite.ts";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const placeOrder = async (req: any, res: Response) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.uid;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order" });
    }

    const orderId = uuidv4();
    const paymentId = "PAY-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const { shippingAddress } = req.body;

    const newOrder = {
      id: orderId,
      userId,
      totalAmount,
      status: "PAID",
      items: JSON.stringify(items),
      paymentId,
      shippingAddress: shippingAddress || "Default Address"
    };

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, userId, totalAmount, status, items, paymentId, shippingAddress)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertOrder.run(newOrder.id, newOrder.userId, newOrder.totalAmount, newOrder.status, newOrder.items, newOrder.paymentId, newOrder.shippingAddress);

    // Update stock
    const updateStock = db.prepare("UPDATE books SET stock = MAX(0, stock - ?) WHERE id = ?");
    for (const item of items) {
      updateStock.run(item.quantity, item.bookId);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Error placing order" });
  }
};

export const getOrderHistory = async (req: any, res: Response) => {
  try {
    const userId = req.user.uid;
    const orders = db.prepare("SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC").all(userId) as any[];
    const formattedOrders = orders.map(o => ({ ...o, items: JSON.parse(o.items) }));
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order history" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = db.prepare("SELECT * FROM orders ORDER BY createdAt DESC").all() as any[];
    const formattedOrders = orders.map(o => ({ ...o, items: JSON.parse(o.items) }));
    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching all orders" });
  }
};
