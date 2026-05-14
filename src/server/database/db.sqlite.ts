import Database from "better-sqlite3";
import path from "path";

class SQLiteConnection {
  private static instance: SQLiteConnection;
  private db: Database.Database;

  private constructor() {
    const dbPath = path.resolve(process.cwd(), "elite_bookshelf.db");
    this.db = new Database(dbPath);
    this.init();
    console.log("SQLite Connection Established at:", dbPath);
  }

  private init() {
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        uid TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        displayName TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'USER',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT,
        price REAL,
        stock INTEGER,
        rating REAL,
        description TEXT,
        imageUrl TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT,
        totalAmount REAL,
        status TEXT DEFAULT 'PENDING',
        items TEXT, -- JSON string
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        paymentId TEXT,
        shippingAddress TEXT,
        FOREIGN KEY (userId) REFERENCES users(uid)
      );
    `);
  }

  public static getInstance(): SQLiteConnection {
    if (!SQLiteConnection.instance) {
      SQLiteConnection.instance = new SQLiteConnection();
    }
    return SQLiteConnection.instance;
  }

  public getDb() {
    return this.db;
  }
}

export const sqlite = SQLiteConnection.getInstance().getDb();
