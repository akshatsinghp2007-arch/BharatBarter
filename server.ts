import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite Database
const db = new Database("bharatbarter.db");

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    displayName TEXT,
    email TEXT,
    photoURL TEXT
  );

  CREATE TABLE IF NOT EXISTS barter_items (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    category TEXT,
    images TEXT, -- JSON string
    estimatedValue REAL,
    city TEXT,
    pincode TEXT,
    userId TEXT,
    userName TEXT,
    userEmail TEXT,
    createdAt TEXT,
    FOREIGN KEY(userId) REFERENCES users(uid)
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Items API
  app.get("/api/items", (req, res) => {
    try {
      const items = db.prepare("SELECT * FROM barter_items ORDER BY createdAt DESC").all();
      const formattedItems = items.map((item: any) => ({
        ...item,
        images: JSON.parse(item.images)
      }));
      res.json(formattedItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.post("/api/items", (req, res) => {
    try {
      const item = req.body;
      const id = Math.random().toString(36).substring(2, 15);
      db.prepare(`
        INSERT INTO barter_items (id, title, description, category, images, estimatedValue, city, pincode, userId, userName, userEmail, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        item.title,
        item.description,
        item.category,
        JSON.stringify(item.images),
        item.estimatedValue,
        item.city,
        item.pincode || null,
        item.userId,
        item.userName,
        item.userEmail,
        item.createdAt
      );
      res.json({ id, ...item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  // Profile API
  app.get("/api/profile/:uid", (req, res) => {
    try {
      const user = db.prepare("SELECT * FROM users WHERE uid = ?").get(req.params.uid);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", (req, res) => {
    try {
      const { uid, displayName, email, photoURL } = req.body;
      db.prepare(`
        INSERT INTO users (uid, displayName, email, photoURL)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(uid) DO UPDATE SET
          displayName = excluded.displayName,
          email = excluded.email,
          photoURL = excluded.photoURL
      `).run(uid, displayName, email, photoURL);
      res.json({ uid, displayName, email, photoURL });
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
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
