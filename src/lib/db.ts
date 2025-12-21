import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "cms.db");
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database | null = null;

export function getDB(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(database: Database.Database) {
  // Users table
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blog posts table
  database.exec(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      content TEXT,
      image TEXT,
      date DATETIME,
      categories TEXT,
      draft BOOLEAN DEFAULT 0,
      featured BOOLEAN DEFAULT 0,
      meta_title TEXT,
      meta_description TEXT,
      frontmatter TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Downloads table
  database.exec(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      file_size TEXT,
      file_type TEXT,
      description TEXT,
      date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Administration members table
  database.exec(`
    CREATE TABLE IF NOT EXISTS administration_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      image TEXT,
      is_lead_team BOOLEAN DEFAULT 0,
      bio TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Media items table
  database.exec(`
    CREATE TABLE IF NOT EXISTS media_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image TEXT,
      link TEXT,
      embed_id TEXT,
      thumbnail TEXT,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for better performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date);
    CREATE INDEX IF NOT EXISTS idx_blog_posts_draft ON blog_posts(draft);
    CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(type);
    CREATE INDEX IF NOT EXISTS idx_administration_members_is_lead ON administration_members(is_lead_team);
  `);
}

// Helper function to serialize JSON for storage
export function serializeJSON(data: any): string {
  return JSON.stringify(data || {});
}

// Helper function to parse JSON from storage
export function parseJSON<T>(data: string | null): T | null {
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

// Close database connection (useful for cleanup)
export function closeDB() {
  if (db) {
    db.close();
    db = null;
  }
}
