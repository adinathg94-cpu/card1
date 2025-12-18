"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { useEffect, useState } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface BrandSliderProps {
	brands: {
		enable: boolean;
		title?: string;
		logos: string[];
	};
}

const BrandSlider = ({ brands }: BrandSliderProps) => {
	const [mounted, setMounted] = useState(false);

	// Only initialize on client-side
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!brands.enable) {
		return null;
	}

	return (
		<div
			data-aos="fade-up-sm"
			data-aos-delay="150"
			className="pt-10 space-y-6"
		>
			<h2
				className="text-center h4"
				dangerouslySetInnerHTML={markdownify(brands.title || "")}
			/>
			<div className="bg-dark/2 py-8 px-4 rounded-2xl overflow-hidden">
				{mounted && (
					<Swiper
						slidesPerView="auto"
						spaceBetween={30}
						loop={true}
						speed={10000}
						autoplay={{
							delay: 0,
							disableOnInteraction: false,
						}}
						modules={[Autoplay]}
						className="brand-slider"
					>
						{[...brands.logos, ...brands.logos].map((item, index) => (
							<SwiperSlide style={{ width: 'auto' }} key={`brand-${index}`}>
								<div className="border-r pr-6 border-border">
									<ImageFallback
										src={item}
										alt="brand"
										width={120}
										height={32}
										className="h-[32px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</div>
		</div>
	);
};

export default BrandSlider;
