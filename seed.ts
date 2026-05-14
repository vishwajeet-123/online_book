import { sqlite as db } from "./src/server/database/db.sqlite.ts";
import { v4 as uuidv4 } from "uuid";

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    price: 15.99,
    stock: 50,
    rating: 4.5,
    description: "A story of ambition, love, and the shifting class dynamics in the Jazz Age.",
    imageUrl: "https://images.unsplash.com/photo-1543004218-283060fe3ee7?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "Non-Fiction",
    price: 22.50,
    stock: 30,
    rating: 4.8,
    description: "A brief history of humankind, exploring how our species evolved and shaped the world.",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    price: 18.99,
    stock: 100,
    rating: 4.9,
    description: "An easy and proven way to build good habits and break bad ones.",
    imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Fiction",
    price: 14.25,
    stock: 45,
    rating: 4.4,
    description: "A shocking psychological thriller of a woman's act of violence against her husband.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    price: 12.99,
    stock: 60,
    rating: 4.7,
    description: "A fable about following your dream.",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Self-Help",
    price: 20.00,
    stock: 25,
    rating: 4.6,
    description: "Rules for focused success in a distracted world.",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Science",
    price: 45.00,
    stock: 15,
    rating: 4.9,
    description: "A handbook of agile software craftsmanship.",
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    category: "Fiction",
    price: 19.99,
    stock: 40,
    rating: 4.8,
    description: "Epic science fiction masterpiece set on the desert planet Arrakis.",
    imageUrl: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    price: 12.50,
    stock: 60,
    rating: 4.9,
    description: "A dystopian social science fiction novel and cautionary tale.",
    imageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    category: "Non-Fiction",
    price: 18.00,
    stock: 20,
    rating: 4.7,
    description: "The two systems that drive the way we think.",
    imageUrl: "https://images.unsplash.com/photo-1531241413948-439973270562?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    price: 16.99,
    stock: 35,
    rating: 4.5,
    description: "A novel about all the choices that go into a life well lived.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
  }
];

export async function seedDatabase() {
  console.log("Elite Bookshelf: Seeding SQLite database...");
  try {
    const row = db.prepare("SELECT COUNT(*) as count FROM books").get() as any;
    if (row.count < 5) {
      console.log("Elite Bookshelf: Injecting library...");
      const insert = db.prepare(`
        INSERT INTO books (id, title, author, category, price, stock, rating, description, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const book of sampleBooks) {
        insert.run(
          uuidv4(),
          book.title,
          book.author,
          book.category,
          book.price,
          book.stock,
          book.rating,
          book.description,
          book.imageUrl
        );
      }

      // Seed Admin
      const adminExists = db.prepare("SELECT * FROM users WHERE email = ?").get("admin@elite.com");
      if (!adminExists) {
        console.log("Elite Bookshelf: Seeding admin user...");
        const bcrypt = await import("bcryptjs");
        const salt = await bcrypt.default.genSalt(10);
        const hashedPassword = await bcrypt.default.hash("admin123", salt);
        
        db.prepare(`
          INSERT INTO users (uid, email, displayName, password, role)
          VALUES (?, ?, ?, ?, ?)
        `).run("admin_demo", "admin@elite.com", "Elite Admin", hashedPassword, "ADMIN");
      }

      console.log("Elite Bookshelf: Seeding complete.");
    } else {
      console.log("Elite Bookshelf: Database already populated.");
    }
  } catch (error) {
    console.error("Elite Bookshelf: FATAL error during seeding:", error);
  }
}
