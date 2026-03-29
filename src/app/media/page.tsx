import TitleBadge from "@/components/TitleBadge";
import { markdownify } from "@/lib/utils/textConverter";
import CallToActionSecondary from "@/partials/CallToActionSecondary";
import SeoMeta from "@/partials/SeoMeta";
import type { RegularPage } from "@/types";
import socialConfig from "@/config/social.json";
import MediaFeed from "./components/MediaFeed";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  let media: any = { frontmatter: {} };
  try {
    const res = await fetch(`${baseUrl}/api/posts?folder=media&isList=true`, {
      cache: "no-store",
    });
    if (res.ok) {
      media = await res.json();
    }
  } catch (error) {
    console.error("Error fetching media index from API:", error);
  }

  const { title, meta_title, description, image, badge } = media.frontmatter;

  // Get media items from database via API
  let allMediaItems: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/media`, { cache: "no-store" });
    if (res.ok) {
      allMediaItems = await res.json();
    }
  } catch (error) {
    console.error("Error fetching media items from API:", error);
  }

  // Group by type
  const successStories = allMediaItems
    .filter((item) => item.type === "success_story")
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
    }));

  const caseStudies = allMediaItems
    .filter((item) => item.type === "case_study")
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
    }));

  const innovations = allMediaItems
    .filter((item) => item.type === "innovation")
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
    }));

  const blogPosts = allMediaItems
    .filter((item) => item.type === "blog_post")
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link || "/blog",
    }));

  const youtubeVideos = allMediaItems
    .filter((item) => item.type === "youtube_video")
    .map((item) => ({
      title: item.title,
      embedId: item.embed_id,
      thumbnail: item.thumbnail || item.image,
    }));

  const printMedia = allMediaItems
    .filter((item) => item.type === "print_media")
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
    }));

  const reels = allMediaItems
    .filter((item) => item.type === "reel")
    .map((item) => ({
      title: item.title,
      description: item.description,
      thumbnail: item.thumbnail || item.image,
      link: item.link,
    }));

  const posters = allMediaItems
    .filter((item) => item.type === "poster")
    .map((item) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      link: item.link,
    }));

  // Get social media links from config
  const facebookLink = socialConfig.main.find((s) => s.name === "facebook")?.link || "#";
  const instagramLink = socialConfig.main.find((s) => s.name === "instagram")?.link || "https://www.instagram.com/";
  const xLink = socialConfig.main.find((s) => s.name === "x")?.link || "#";

  const socialLinks = {
    facebook: facebookLink,
    instagram: instagramLink,
    x: xLink,
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
                className="text-center text-balance text-[18px] tracking-[0.0005px] leading-[1.69]"
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



