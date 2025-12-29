import { getDB } from "../src/lib/db";

async function updateYouTubeVideos() {
    console.log("Updating YouTube video embed IDs...");
    const db = getDB();

    const newEmbedId = "g4XW6uq8ivo";

    try {
        // Update Community Impact Stories
        const result1 = db.prepare(
            `UPDATE media_items 
       SET embed_id = ? 
       WHERE type = 'youtube_video' AND title = 'Community Impact Stories'`
        ).run(newEmbedId);

        console.log(`  ✓ Updated Community Impact Stories (affected rows: ${result1.changes})`);

        // Update Annual Report 2023
        const result2 = db.prepare(
            `UPDATE media_items 
       SET embed_id = ? 
       WHERE type = 'youtube_video' AND title = 'Annual Report 2023'`
        ).run(newEmbedId);

        console.log(`  ✓ Updated Annual Report 2023 (affected rows: ${result2.changes})`);

        // Verify the updates
        const videos = db.prepare(
            `SELECT title, embed_id FROM media_items 
       WHERE type = 'youtube_video' 
       AND title IN ('Community Impact Stories', 'Annual Report 2023')`
        ).all();

        console.log("\nVerifying updates:");
        videos.forEach((video: any) => {
            console.log(`  - ${video.title}: ${video.embed_id}`);
        });

        console.log("\n✅ YouTube videos updated successfully!");
    } catch (error: any) {
        console.error("Error updating YouTube videos:", error.message);
        process.exit(1);
    }
}

// Run the script
updateYouTubeVideos().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
