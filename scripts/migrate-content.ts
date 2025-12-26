import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getDB, serializeJSON } from "../src/lib/db";
import bcrypt from "bcryptjs";

const contentPath = path.join(process.cwd(), "src/content");

async function migrateContent() {
  console.log("Starting content migration...");
  const db = getDB();

  // Create default admin user if it doesn't exist
  const existingUser = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get("admin");

  if (!existingUser) {
    const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(
      "admin",
      passwordHash
    );
    console.log("Created default admin user (username: admin, password: admin123)");
    console.log("⚠️  Please change the default password after first login!");
  }

  // Migrate blog posts
  console.log("\nMigrating blog posts...");
  try {
    const blogPath = path.join(contentPath, "blog");
    if (fs.existsSync(blogPath)) {
      const files = fs.readdirSync(blogPath);
      const blogFiles = files.filter(
        (file) => file.endsWith(".md") && !file.startsWith("_")
      );

      for (const file of blogFiles) {
        const filePath = path.join(blogPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const { data: frontmatter, content: body } = matter(content);
        const slug = file.replace(".md", "");

        try {
          // Ensure all values are properly typed for SQLite
          const title = String(frontmatter.title || "");
          const description = frontmatter.description ? String(frontmatter.description) : null;
          const content = body || null;
          const image = frontmatter.image ? String(frontmatter.image) : null;
          const date = frontmatter.date ? String(frontmatter.date) : new Date().toISOString();
          const categories = serializeJSON(frontmatter.categories || []);
          const draft = frontmatter.draft ? 1 : 0;
          const featured = frontmatter.featured ? 1 : 0;
          const metaTitle = frontmatter.meta_title ? String(frontmatter.meta_title) : null;
          const metaDescription = frontmatter.meta_description ? String(frontmatter.meta_description) : null;
          const frontmatterJson = serializeJSON(frontmatter);

          db.prepare(
            `INSERT INTO blog_posts (
            slug, title, description, content, image, date, categories,
            draft, featured, meta_title, meta_description, frontmatter
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).run(
            slug,
            title,
            description,
            content,
            image,
            date,
            categories,
            draft,
            featured,
            metaTitle,
            metaDescription,
            frontmatterJson
          );
          console.log(`  ✓ Migrated blog post: ${slug}`);
        } catch (error: any) {
          if (error.message?.includes("UNIQUE constraint")) {
            console.log(`  ⊘ Skipped (already exists): ${slug}`);
          } else {
            console.error(`  ✗ Error migrating ${slug}:`, error.message);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error migrating blog posts:", error);
  }

  // Migrate team members from teams folder
  console.log("\nMigrating team members from teams folder...");
  try {
    const teamsPath = path.join(contentPath, "teams");
    if (fs.existsSync(teamsPath)) {
      const files = fs.readdirSync(teamsPath);
      const teamFiles = files.filter(
        (file) => file.endsWith(".md") && !file.startsWith("_")
      );

      for (const file of teamFiles) {
        const filePath = path.join(teamsPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const { data: frontmatter } = matter(content);

        try {
          db.prepare(
            `INSERT INTO administration_members (
            name, designation, image, is_lead_team, bio, order_index
          ) VALUES (?, ?, ?, ?, ?, ?)`
          ).run(
            frontmatter.name || "",
            frontmatter.designation || "",
            frontmatter.image || null,
            frontmatter.isLeadTeam ? 1 : 0,
            frontmatter.bio || null,
            frontmatter.order_index || 0
          );
          console.log(`  ✓ Migrated team member: ${frontmatter.name}`);
        } catch (error: any) {
          if (error.message?.includes("UNIQUE constraint")) {
            console.log(`  ⊘ Skipped (already exists): ${frontmatter.name}`);
          } else {
            console.error(
              `  ✗ Error migrating ${frontmatter.name}:`,
              error.message
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("Error migrating team members:", error);
  }

  // Migrate team members from about/_index.md
  console.log("\nMigrating team members from about page...");
  try {
    const aboutPath = path.join(contentPath, "about/_index.md");
    if (fs.existsSync(aboutPath)) {
      const content = fs.readFileSync(aboutPath, "utf-8");
      const { data: frontmatter } = matter(content);

      if (frontmatter.team?.members && Array.isArray(frontmatter.team.members)) {
        for (const member of frontmatter.team.members) {
          try {
            // Check if member already exists
            const existing = db
              .prepare("SELECT id FROM administration_members WHERE name = ?")
              .get(member.name);

            if (!existing) {
              db.prepare(
                `INSERT INTO administration_members (
                name, designation, image, is_lead_team, bio, order_index
              ) VALUES (?, ?, ?, ?, ?, ?)`
              ).run(
                member.name || "",
                member.designation || "",
                member.image || null,
                0, // Default to not lead team
                null,
                0
              );
              console.log(`  ✓ Migrated team member: ${member.name}`);
            } else {
              console.log(`  ⊘ Skipped (already exists): ${member.name}`);
            }
          } catch (error: any) {
            console.error(`  ✗ Error migrating ${member.name}:`, error.message);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error migrating team members from about page:", error);
  }

  console.log("\n✅ Migration completed!");
  console.log("\nNext steps:");
  console.log("1. Log in to /admin/login with username: admin, password: admin123");
  console.log("2. Change the default password");
  console.log("3. Start managing your content through the admin panel!");
}

// Run migration
migrateContent().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});

