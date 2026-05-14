import { sqlite as db } from "../database/db.sqlite.ts";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let sql = "SELECT * FROM books WHERE 1=1";
    const params: any[] = [];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    if (search) {
      sql += " AND (LOWER(title) LIKE ? OR LOWER(author) LIKE ?)";
      const searchPattern = `%${(search as string).toLowerCase()}%`;
      params.push(searchPattern, searchPattern);
    }

    const books = db.prepare(sql).all(...params);
    res.json(books);
  } catch (error) {
    console.error("Fetch Books Error:", error);
    res.status(500).json({ error: "Error fetching books" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = db.prepare("SELECT * FROM books WHERE id = ?").get(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Error fetching book" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const { title, author, category, price, stock, rating, description, imageUrl } = req.body;
    
    db.prepare(`
      INSERT INTO books (id, title, author, category, price, stock, rating, description, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, author, category, price, stock, rating, description, imageUrl);

    res.status(201).json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Error creating book" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const { title, author, category, price, stock, rating, description, imageUrl } = req.body;
    
    db.prepare(`
      UPDATE books 
      SET title = ?, author = ?, category = ?, price = ?, stock = ?, rating = ?, description = ?, imageUrl = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, author, category, price, stock, rating, description, imageUrl, bookId);

    res.json({ id: bookId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Error updating book" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    db.prepare("DELETE FROM books WHERE id = ?").run(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting book" });
  }
};
