import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Routes
import authRoutes from "./src/server/routes/auth.routes.ts";
import bookRoutes from "./src/server/routes/book.routes.ts";
import orderRoutes from "./src/server/routes/order.routes.ts";
import cartRoutes from "./src/server/routes/cart.routes.ts";
import adminRoutes from "./src/server/routes/admin.routes.ts";

dotenv.config();

// Seeding
import { seedDatabase } from "./seed.ts";
seedDatabase().catch(console.error);

const PORT = 3000;
const distPath = path.join(process.cwd(), 'dist');

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/admin", adminRoutes);

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Elite Bookshelf API is running" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
