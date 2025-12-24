import { getDB } from "../src/lib/db";

async function addSampleMedia() {
  console.log("Adding sample media content...");
  const db = getDB();

  const sampleMedia = [
    // Success Stories
    {
      type: "success_story",
      title: "Transforming Lives in Rural Communities",
      description: "How our programs have impacted over 10,000 families across rural India, providing education, healthcare, and sustainable livelihoods.",
      image: "/images/about.png",
      link: "/blog",
      embed_id: null,
      thumbnail: null,
      order_index: 0,
    },
    {
      type: "success_story",
      title: "Education for All Initiative",
      description: "Building schools and providing quality education to children in underserved communities, creating pathways to brighter futures.",
      image: "/images/about.png",
      link: "/blog",
      embed_id: null,
      thumbnail: null,
      order_index: 1,
    },
    {
      type: "success_story",
      title: "Healthcare Access Project",
      description: "Improving healthcare access in remote areas through mobile clinics and community health programs.",
      image: "/images/about.png",
      link: "/blog",
      embed_id: null,
      thumbnail: null,
      order_index: 2,
    },
    // Case Studies
    {
      type: "case_study",
      title: "Disaster Relief Program 2023",
      description: "Comprehensive response to natural disasters, providing immediate relief and long-term recovery support to affected communities.",
      image: "/images/about.png",
      link: "/blog",
      embed_id: null,
      thumbnail: null,
      order_index: 0,
    },
    {
      type: "case_study",
      title: "Sustainable Agriculture Program",
      description: "Empowering farmers with modern techniques and sustainable practices for better yields and environmental conservation.",
      image: "/images/about.png",
      link: "/blog",
      embed_id: null,
      thumbnail: null,
      order_index: 1,
    },
    // Innovations
    {
      type: "innovation",
      title: "Digital Learning Platform",
      description: "Revolutionizing education through technology, bringing quality learning resources to remote areas.",
      image: "/images/about.png",
      link: "/blog",
      embed_id: null,
      thumbnail: null,
      order_index: 0,
    },
    {
      type: "innovation",
      title: "Community Water Management",
      description: "Innovative water harvesting and management systems ensuring clean water access for communities.",
      image: "/images/about.png",
      link: "/blog",
      embed_id: null,
      thumbnail: null,
      order_index: 1,
    },
    // YouTube Videos
    {
      type: "youtube_video",
      title: "Our Mission in Action",
      description: "Watch how CARD is making a difference in communities across India.",
      image: null,
      link: null,
      embed_id: "dyZcRRWiuuw",
      thumbnail: "/images/about.png",
      order_index: 0,
    },
    {
      type: "youtube_video",
      title: "Community Impact Stories",
      description: "Real stories from the communities we serve, showcasing the positive impact of our programs.",
      image: null,
      link: null,
      embed_id: "dyZcRRWiuuw",
      thumbnail: "/images/about.png",
      order_index: 1,
    },
    {
      type: "youtube_video",
      title: "Annual Report 2023",
      description: "A comprehensive overview of our activities and achievements in 2023.",
      image: null,
      link: null,
      embed_id: "dyZcRRWiuuw",
      thumbnail: "/images/about.png",
      order_index: 2,
    },
    // Print Media
    {
      type: "print_media",
      title: "Newspaper Coverage - January 2024",
      description: "Featured article about our community development initiatives.",
      image: "/images/about.png",
      link: "#",
      embed_id: null,
      thumbnail: null,
      order_index: 0,
    },
    {
      type: "print_media",
      title: "Magazine Feature - December 2023",
      description: "In-depth coverage of our sustainable development programs.",
      image: "/images/about.png",
      link: "#",
      embed_id: null,
      thumbnail: null,
      order_index: 1,
    },
    // Reels
    {
      type: "reel",
      title: "Day in the Life",
      description: "A day in the life of our field workers",
      image: null,
      link: "#",
      embed_id: null,
      thumbnail: "/images/about.png",
      order_index: 0,
    },
    {
      type: "reel",
      title: "Impact Highlights",
      description: "Quick highlights of our impact this year",
      image: null,
      link: "#",
      embed_id: null,
      thumbnail: "/images/about.png",
      order_index: 1,
    },
    {
      type: "reel",
      title: "Volunteer Stories",
      description: "Stories from our dedicated volunteers",
      image: null,
      link: "#",
      embed_id: null,
      thumbnail: "/images/about.png",
      order_index: 2,
    },
    {
      type: "reel",
      title: "Event Recap",
      description: "Highlights from our recent community event",
      image: null,
      link: "#",
      embed_id: null,
      thumbnail: "/images/about.png",
      order_index: 3,
    },
    // Posters
    {
      type: "poster",
      title: "Campaign Poster 2024",
      description: "Join us in making a difference",
      image: "/images/about.png",
      link: "#",
      embed_id: null,
      thumbnail: null,
      order_index: 0,
    },
    {
      type: "poster",
      title: "Event Announcement",
      description: "Upcoming community event",
      image: "/images/about.png",
      link: "#",
      embed_id: null,
      thumbnail: null,
      order_index: 1,
    },
  ];

  let added = 0;
  let skipped = 0;

  for (const item of sampleMedia) {
    try {
      db.prepare(
        `INSERT INTO media_items (type, title, description, image, link, embed_id, thumbnail, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        item.type,
        item.title,
        item.description,
        item.image,
        item.link,
        item.embed_id,
        item.thumbnail,
        item.order_index
      );
      added++;
      console.log(`  ✓ Added: ${item.title} (${item.type})`);
    } catch (error: any) {
      if (error.message?.includes("UNIQUE constraint")) {
        skipped++;
        console.log(`  ⊘ Skipped (already exists): ${item.title}`);
      } else {
        console.error(`  ✗ Error adding ${item.title}:`, error.message);
      }
    }
  }

  console.log(`\n✅ Sample media content added!`);
  console.log(`   Added: ${added} items`);
  console.log(`   Skipped: ${skipped} items (already exist)`);
}

// Run the script
addSampleMedia().catch((error) => {
  console.error("Error adding sample media:", error);
  process.exit(1);
});

