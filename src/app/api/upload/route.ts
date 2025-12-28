import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedFileTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (type === "image" && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }

    if (type === "file" && !allowedFileTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PDF, DOC, DOCX" },
        { status: 400 }
      );
    }

    // Validate file size
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    if (type === "image" && file.size > maxImageSize) {
      return NextResponse.json(
        { error: "Image size must be less than 10MB" },
        { status: 400 }
      );
    }

    if (type === "file" && file.size > maxFileSize) {
      return NextResponse.json(
        { error: "File size must be less than 50MB" },
        { status: 400 }
      );
    }

    // Create uploads directory structure
    const uploadDir = type === "image" ? "public/uploads/images" : "public/uploads/files";
    const uploadPath = path.join(process.cwd(), uploadDir);

    try {
      await mkdir(uploadPath, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Generate unique filename with sanitization
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.name).toLowerCase();

    // Validate extension against whitelist
    const allowedExtensions = type === 'image'
      ? ['.jpg', '.jpeg', '.png', '.webp', '.gif']
      : ['.pdf', '.doc', '.docx'];

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: 'Invalid file extension' },
        { status: 400 }
      );
    }


    // Generate unique filename (using timestamp and random string for uniqueness)
    const filename = `${timestamp}-${randomStr}${ext}`;
    const filepath = path.join(uploadPath, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return URL
    const url = `/${uploadDir}/${filename}`.replace("public/", "");

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

