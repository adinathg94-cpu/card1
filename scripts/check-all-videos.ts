import { getDB } from "../src/lib/db";

async function checkAllVideos() {
    console.log("Checking all YouTube videos in database...\n");
    const db = getDB();

    try {
        // Get all YouTube videos
        const videos = db.prepare(
            `SELECT id, title, embed_id FROM media_items 
       WHERE type = 'youtube_video'
       ORDER BY order_index`
        ).all();

        console.log(`Found ${videos.length} YouTube videos:\n`);
        videos.forEach((video: any) => {
            console.log(`  ID: ${video.id}`);
            console.log(`  Title: ${video.title}`);
            console.log(`  Embed ID: ${video.embed_id}`);
            console.log(`  URL: https://www.youtube.com/embed/${video.embed_id}`);
            console.log(`---`);
        });
    } catch (error: any) {
        console.error("Error checking videos:", error.message);
        process.exit(1);
    }
}

// Run the script
checkAllVideos().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
