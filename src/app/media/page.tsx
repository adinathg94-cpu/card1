import TitleBadge from "@/components/TitleBadge";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { RegularPage } from "@/types";
import socialConfig from "@/config/social.json";
import MediaFeed from "./components/MediaFeed";

// Sample data - in production, this would come from a CMS or API
const successStories = [
  {
    title: "Transforming Lives in Rural Communities",
    description: "How our programs have impacted over 10,000 families",
    image: "/images/about.png",
    link: "#"
  },
  {
    title: "Education for All Initiative",
    description: "Building schools and providing quality education",
    image: "/images/about.png",
    link: "#"
  }
];

const caseStudies = [
  {
    title: "Disaster Relief Program 2023",
    description: "Comprehensive response to natural disasters",
    image: "/images/about.png",
    link: "#"
  },
  {
    title: "Healthcare Access Project",
    description: "Improving healthcare in underserved areas",
    image: "/images/about.png",
    link: "#"
  }
];

const innovations = [
  {
    title: "Digital Learning Platform",
    description: "Revolutionizing education through technology",
    image: "/images/about.png",
    link: "#"
  },
  {
    title: "Sustainable Agriculture Program",
    description: "Innovative farming techniques for better yields",
    image: "/images/about.png",
    link: "#"
  }
];

const blogPosts = [
  {
    title: "Latest Updates from the Field",
    description: "Read about our recent activities",
    image: "/images/about.png",
    link: "/blog"
  }
];

const youtubeVideos = [
  {
    title: "Our Mission in Action",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "/images/about.png"
  },
  {
    title: "Community Impact Stories",
    embedId: "dQw4w9WgXcQ",
    thumbnail: "/images/about.png"
  }
];

const printMedia = [
  {
    title: "Newspaper Coverage - January 2024",
    image: "/images/about.png",
    link: "#"
  },
  {
    title: "Magazine Feature - December 2023",
    image: "/images/about.png",
    link: "#"
  }
];

const reels = [
  {
    title: "Day in the Life",
    thumbnail: "/images/about.png",
    link: "#"
  },
  {
    title: "Impact Highlights",
    thumbnail: "/images/about.png",
    link: "#"
  },
  {
    title: "Volunteer Stories",
    thumbnail: "/images/about.png",
    link: "#"
  },
  {
    title: "Event Recap",
    thumbnail: "/images/about.png",
    link: "#"
  },
  {
    title: "Behind the Scenes",
    thumbnail: "/images/about.png",
    link: "#"
  }
];

const posters = [
  {
    title: "Campaign Poster 2024",
    image: "/images/about.png",
    link: "#"
  },
  {
    title: "Event Announcement",
    image: "/images/about.png",
    link: "#"
  }
];

export default function MediaPage() {
  const media = getListPage<RegularPage["frontmatter"]>("media/_index.md");
  const { title, meta_title, description, image, badge } = media.frontmatter;

  // Get social media links from config
  const facebookLink = socialConfig.main.find(s => s.name === "facebook")?.link || "#";
  const instagramLink = socialConfig.main.find(s => s.name === "instagram")?.link || "https://www.instagram.com/";
  const xLink = socialConfig.main.find(s => s.name === "x")?.link || "#";

  const socialLinks = {
    facebook: facebookLink,
    instagram: instagramLink,
    x: xLink
  };

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <section className="section-lg pb-10">
        <div className="container">
          <div
            data-aos="fade-up-sm"
            data-aos-delay="150"
            className="row justify-center"
          >
            <div className="col-10 lg:col-7">
              {badge && badge.enable && (
                <TitleBadge
                  icon={badge.icon}
                  label={badge.label}
                  bg_color={badge.bg_color}
                />
              )}
              <h2
                className="py-4 text-center"
                dangerouslySetInnerHTML={markdownify(title || "")}
              />
              <p
                className="text-center text-balance"
                dangerouslySetInnerHTML={markdownify(description || "")}
              />
            </div>
          </div>
        </div>
      </section>

      <MediaFeed
        successStories={successStories}
        caseStudies={caseStudies}
        innovations={innovations}
        blogPosts={blogPosts}
        youtubeVideos={youtubeVideos}
        printMedia={printMedia}
        reels={reels}
        posters={posters}
        socialLinks={socialLinks}
      />

      <CallToActionSecondary isNoSectionTop={true} />
    </>
  );
}

