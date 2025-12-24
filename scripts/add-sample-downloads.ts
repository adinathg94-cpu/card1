import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { writeFile, mkdir } from "fs/promises";

// Create a minimal valid PDF content (PDF header + minimal structure)
const createMinimalPDF = (): Buffer => {
  // Minimal valid PDF structure
  const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 <<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
>>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Sample PDF Document) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000306 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
390
%%EOF`;
  return Buffer.from(pdfContent);
};

async function addSampleDownloads() {
  const dbPath = path.join(process.cwd(), "data", "cms.db");
  const db = new Database(dbPath);
  
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "files");
    
    // Ensure uploads directory exists
    await mkdir(uploadsDir, { recursive: true });

    // Check if Home Page.pdf exists and use it as template, otherwise create minimal PDFs
    const templatePdfPath = path.join(process.cwd(), "Home Page.pdf");
    let pdfBuffer: Buffer;
    
    if (fs.existsSync(templatePdfPath)) {
      pdfBuffer = fs.readFileSync(templatePdfPath);
    } else {
      pdfBuffer = createMinimalPDF();
    }

    const downloads = [
      {
        name: "Grameenam.pdf",
        filename: "grameenam.pdf",
        description: "Grameenam document",
        date: new Date().toISOString(),
      },
      {
        name: "Annual Reports 2025.pdf",
        filename: "annual-reports-2025.pdf",
        description: "Annual Reports for the year 2025",
        date: new Date("2025-01-01").toISOString(),
      },
    ];

    for (const download of downloads) {
      // Check if download already exists
      const existing = db
        .prepare("SELECT id FROM downloads WHERE name = ?")
        .get(download.name);

      if (existing) {
        console.log(`Download "${download.name}" already exists, skipping...`);
        continue;
      }

      // Save PDF file
      const filePath = path.join(uploadsDir, download.filename);
      await writeFile(filePath, pdfBuffer);

      // Calculate file size
      const fileSize = (pdfBuffer.length / 1024).toFixed(1) + " KB";

      // Add to database
      const result = db
        .prepare(
          `INSERT INTO downloads (name, url, file_size, file_type, description, date)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .run(
          download.name,
          `/uploads/files/${download.filename}`,
          fileSize,
          "application/pdf",
          download.description,
          download.date
        );

      console.log(`✓ Added download: ${download.name} (ID: ${result.lastInsertRowid})`);
    }

    console.log("\n✅ Sample downloads added successfully!");
  } catch (error) {
    console.error("Error adding sample downloads:", error);
    process.exit(1);
  } finally {
    if (db) {
      db.close();
    }
  }
}

addSampleDownloads();

