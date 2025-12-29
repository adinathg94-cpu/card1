import { getDB } from "../src/lib/db";

async function updateAllYouTubeVideos() {
    console.log("Updating ALL YouTube video embed IDs...\n");
    const db = getDB();

    const newEmbedId = "g4XW6uq8ivo";

    try {
        // Update ALL YouTube videos
        const result = db.prepare(
            `UPDATE media_items 
       SET embed_id = ? 
       WHERE type = 'youtube_video'`
        ).run(newEmbedId);

        console.log(`  ✓ Updated ${result.changes} YouTube videos\n`);

        // Verify the updates
        const videos = db.prepare(
            `SELECT id, title, embed_id FROM media_items 
       WHERE type = 'youtube_video'
       ORDER BY order_index`
        ).all();

        console.log("Verifying all videos now have the new embed ID:\n");
        videos.forEach((video: any) => {
            console.log(`  ✓ ${video.title}`);
            console.log(`    Embed ID: ${video.embed_id}`);
            console.log(`    URL: https://www.youtube.com/embed/${video.embed_id}\n`);
        });

        console.log("✅ All YouTube videos updated successfully!");
    } catch (error: any) {
        console.error("Error updating YouTube videos:", error.message);
        process.exit(1);
    }
}

// Run the script
updateAllYouTubeVideos().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
