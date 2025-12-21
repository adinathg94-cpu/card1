"use client";

import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import {
    FaFacebook,
    FaInstagram,
    FaXTwitter,
    FaYoutube,
    FaNewspaper,
    FaVideo,
    FaImage,
    FaBook,
    FaLightbulb,
    FaChartLine,
    FaPlay,
    FaArrowRight
} from "react-icons/fa6";

interface MediaItem {
    title: string;
    description?: string;
    image?: string;
    thumbnail?: string;
    link?: string;
    embedId?: string;
}

interface SocialLinks {
    facebook: string;
    instagram: string;
    x: string;
}

interface MediaFeedProps {
    successStories: MediaItem[];
    caseStudies: MediaItem[];
    innovations: MediaItem[];
    blogPosts: MediaItem[];
    youtubeVideos: MediaItem[];
    printMedia: MediaItem[];
    reels: MediaItem[];
    posters: MediaItem[];
    socialLinks: SocialLinks;
}

export default function MediaFeed({
    successStories,
    caseStudies,
    innovations,
    blogPosts,
    youtubeVideos,
    printMedia,
    reels,
    posters,
    socialLinks
}: MediaFeedProps) {

    return (
        <div className="flex flex-col gap-20 pb-20">

            {/* Success Stories - Hero Slider */}
            {successStories.length > 0 && (
                <section className="relative group">
                    <div className="container">
                        <div className="flex items-center gap-3 mb-8" data-aos="fade-up">
                            <FaChartLine className="text-3xl text-primary" />
                            <h2 className="h3">Success Stories</h2>
                        </div>

                        <Swiper
                            modules={[Autoplay, Pagination, Navigation, EffectFade]}
                            effect="fade"
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            navigation={true}
                            className="rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] md:aspect-[21/9]"
                            data-aos="zoom-in"
                        >
                            {successStories.map((story, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative w-full h-full">
                                        <ImageFallback
                                            src={story.image!}
                                            alt={story.title}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8 md:p-16">
                                            <div className="max-w-3xl">
                                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{story.title}</h3>
                                                <p className="text-white/90 text-lg md:text-xl mb-8 line-clamp-2">{story.description}</p>
                                                <Link
                                                    href={story.link || "#"}
                                                    className="btn btn-primary border-none hover:bg-white hover:text-primary transition-colors"
                                                >
                                                    Read Full Story
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* Case Studies & Innovations - Alternating Grid */}
            {(caseStudies.length > 0 || innovations.length > 0) && (
                <section className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Case Studies */}
                        {caseStudies.length > 0 && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3 mb-2" data-aos="fade-right">
                                    <FaBook className="text-2xl text-primary" />
                                    <h2 className="h4">Case Studies</h2>
                                </div>
                                <div className="grid gap-6">
                                    {caseStudies.map((study, index) => (
                                        <Link
                                            key={index}
                                            href={study.link || "#"}
                                            className="group flex gap-4 bg-white dark:bg-dark-theme-light rounded-2xl p-4 shadow-sm hover:shadow-md transition-all border border-border/50"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="relative w-32 h-24 shrink-0 rounded-xl overflow-hidden">
                                                <ImageFallback
                                                    src={study.image!}
                                                    alt={study.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">{study.title}</h3>
                                                <p className="text-sm text-text-light dark:text-text-dark line-clamp-2">{study.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Innovations */}
                        {innovations.length > 0 && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3 mb-2" data-aos="fade-left">
                                    <FaLightbulb className="text-2xl text-primary" />
                                    <h2 className="h4">Innovations</h2>
                                </div>
                                <div className="grid gap-6">
                                    {innovations.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.link || "#"}
                                            className="group relative overflow-hidden rounded-2xl aspect-[2/1]"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <ImageFallback
                                                src={item.image!}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors flex flex-col justify-center items-center text-center p-6">
                                                <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                                                <p className="text-white/80 text-sm">{item.description}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Reels - Horizontal Scroll */}
            {reels.length > 0 && (
                <section className="bg-theme-light dark:bg-dark-theme-light py-16">
                    <div className="container">
                        <div className="flex items-center justify-between mb-8" data-aos="fade-up">
                            <div className="flex items-center gap-3">
                                <FaVideo className="text-3xl text-primary" />
                                <h2 className="h3">Shorts & Reels</h2>
                            </div>
                            <div className="flex gap-2">
                                {/* Custom navigation buttons could go here */}
                            </div>
                        </div>

                        <Swiper
                            modules={[Autoplay, Pagination]}
                            spaceBetween={20}
                            slidesPerView={1.5}
                            breakpoints={{
                                640: { slidesPerView: 2.5 },
                                1024: { slidesPerView: 4.5 },
                            }}
                            loop={true}
                            className="!pb-12"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            {reels.map((reel, index) => (
                                <SwiperSlide key={index}>
                                    <Link href={reel.link || "#"} className="block group relative rounded-2xl overflow-hidden aspect-[9/16] shadow-lg">
                                        <ImageFallback
                                            src={reel.thumbnail!}
                                            alt={reel.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                                <FaPlay className="ml-1 text-sm" />
                                            </div>
                                            <h3 className="text-white font-semibold leading-tight">{reel.title}</h3>
                                        </div>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* Blog Posts */}
            {blogPosts.length > 0 && (
                <section className="container">
                    <div className="flex items-center gap-3 mb-8" data-aos="fade-up">
                        <FaBook className="text-3xl text-primary" />
                        <h2 className="h3">Latest Updates</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post, index) => (
                            <Link
                                key={index}
                                href={post.link || "#"}
                                className="group bg-white dark:bg-dark-theme-light rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <ImageFallback
                                        src={post.image!}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                                    <p className="text-text-light dark:text-text-dark mb-4 line-clamp-2">{post.description}</p>
                                    <span className="text-primary font-semibold text-sm uppercase tracking-wider">Read More</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* YouTube Videos - Featured + List */}
            {youtubeVideos.length > 0 && (
                <section className="container">
                    <div className="flex items-center gap-3 mb-8" data-aos="fade-up">
                        <FaYoutube className="text-3xl text-red-600" />
                        <h2 className="h3">Latest Videos</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Featured Video (First one) */}
                        <div className="lg:col-span-2" data-aos="fade-right">
                            <div className="rounded-2xl overflow-hidden shadow-xl bg-black aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${youtubeVideos[0].embedId}`}
                                    title={youtubeVideos[0].title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <h3 className="mt-4 text-2xl font-bold">{youtubeVideos[0].title}</h3>
                        </div>

                        {/* Video List (Rest) */}
                        <div className="flex flex-col gap-4" data-aos="fade-left">
                            {youtubeVideos.slice(1).map((video, index) => (
                                <div key={index} className="flex gap-4 group cursor-pointer">
                                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0">
                                        <iframe
                                            className="w-full h-full pointer-events-none" // Disable interaction for thumbnail feel
                                            src={`https://www.youtube.com/embed/${video.embedId}?controls=0`}
                                            title={video.title}
                                            tabIndex={-1}
                                        ></iframe>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h4>
                                        <span className="text-xs text-text-light dark:text-text-dark mt-1 block">Watch Video</span>
                                    </div>
                                </div>
                            ))}
                            <Link href="https://youtube.com" target="_blank" className="mt-auto flex items-center gap-2 text-primary font-semibold hover:underline">
                                View Channel <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Print Media & Posters - Masonry-ish Grid */}
            {(printMedia.length > 0 || posters.length > 0) && (
                <section className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Print Media */}
                        {printMedia.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-8" data-aos="fade-up">
                                    <FaNewspaper className="text-3xl text-primary" />
                                    <h2 className="h3">In The News</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {printMedia.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.link || "#"}
                                            className="group block"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="rounded-xl overflow-hidden shadow-md mb-3">
                                                <ImageFallback
                                                    src={item.image!}
                                                    alt={item.title}
                                                    width={400}
                                                    height={300}
                                                    className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Posters */}
                        {posters.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-8" data-aos="fade-up">
                                    <FaImage className="text-3xl text-primary" />
                                    <h2 className="h3">Campaigns</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {posters.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.link || "#"}
                                            className="group block"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="rounded-xl overflow-hidden shadow-md mb-3">
                                                <ImageFallback
                                                    src={item.image!}
                                                    alt={item.title}
                                                    width={400}
                                                    height={500}
                                                    className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <h3 className="font-semibold text-sm text-center group-hover:text-primary transition-colors">{item.title}</h3>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Social Media Banner */}
            <section className="bg-primary/5 py-16">
                <div className="container text-center">
                    <h2 className="h3 mb-8" data-aos="fade-up">Connect With Us</h2>
                    <div className="flex justify-center gap-6 md:gap-12">
                        <Link
                            href={socialLinks.facebook}
                            target="_blank"
                            className="flex flex-col items-center gap-3 group"
                            data-aos="fade-up" data-aos-delay="100"
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-all duration-300">
                                <FaFacebook className="text-3xl text-[#1877F2] group-hover:text-white" />
                            </div>
                            <span className="font-semibold">Facebook</span>
                        </Link>

                        <Link
                            href={socialLinks.instagram}
                            target="_blank"
                            className="flex flex-col items-center gap-3 group"
                            data-aos="fade-up" data-aos-delay="200"
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-[#E4405F] group-hover:text-white transition-all duration-300">
                                <FaInstagram className="text-3xl text-[#E4405F] group-hover:text-white" />
                            </div>
                            <span className="font-semibold">Instagram</span>
                        </Link>

                        <Link
                            href={socialLinks.x}
                            target="_blank"
                            className="flex flex-col items-center gap-3 group"
                            data-aos="fade-up" data-aos-delay="300"
                        >
                            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                <FaXTwitter className="text-3xl text-black group-hover:text-white" />
                            </div>
                            <span className="font-semibold">X (Twitter)</span>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
