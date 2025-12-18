"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { Homepage } from '@/types';
import { useEffect } from 'react';

import 'swiper/css';

const Partners = ({ partners }: { partners: Homepage["frontmatter"]["banner"]["partners"] }) => {
	useEffect(() => {
		// Load Swiper once
		const loadSwiper = async () => {
			try {
				const SwiperModule = await import('swiper');
				const { Autoplay } = await import('swiper/modules');

				const Swiper = SwiperModule.default;

				new Swiper('.brand-slider', {
					modules: [Autoplay],
					slidesPerView: 'auto',
					spaceBetween: 30,
					loop: true,
					loopAdditionalSlides: 10, // For smoother infinite loop
					speed: 10000,
					autoplay: {
						delay: 0,
						disableOnInteraction: false,
					},
					// smooth linear animation
					freeMode: {
						enabled: true,
						momentum: false,
					},
				});
			} catch (error) {
				console.error("Failed to initialize Swiper:", error);
			}
		};

		// Small delay to ensure DOM is ready
		const timer = setTimeout(loadSwiper, 100);
		return () => clearTimeout(timer);
	}, []);

	if (!partners?.logos || partners.logos.length === 0) {
		return null;
	}

	return (
		<div className="pt-10 space-y-6">
			{partners.title && (
				<p
					dangerouslySetInnerHTML={markdownify(partners.title)}
					className="text-lg max-lg:text-center"
				/>
			)}

			<div className="overflow-hidden">
				<div className="brand-slider">
					<div className="swiper-wrapper">
						{/* Double the logos for smoother infinite loop */}
						{[...partners.logos, ...partners.logos].map((logo, index) => (
							<div key={index} className="swiper-slide" style={{ width: 'auto' }}>
								<ImageFallback
									src={logo}
									alt="Partner logo"
									width={150}
									height={32}
									className="h-[32px] grayscale opacity-70"
									loading="eager"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Partners