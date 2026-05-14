import { sqlite as db } from "../database/db.sqlite.ts";
import { UserFactory, UserRole } from "../models/UserFactory.ts";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "elite_bookshelf_secret_key_123";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName, role } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role === "ADMIN" ? UserRole.ADMIN : UserRole.CUSTOMER;
    const uid = uuidv4();
    const newUser = UserFactory.createUser(uid, email, displayName, userRole);

    db.prepare(`
      INSERT INTO users (uid, email, displayName, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(uid, email, displayName, hashedPassword, userRole);

    res.status(201).json({ message: "User registered successfully", userId: uid });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const userData = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    
    if (!userData) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { uid: userData.uid, email: userData.email, role: userData.role },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.json({
      token,
      user: {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userData = db.prepare("SELECT * FROM users WHERE uid = ?").get(req.user.uid) as any;
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    delete userData.password;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};
