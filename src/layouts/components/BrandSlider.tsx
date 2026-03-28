"use client";

import { markdownify } from "@/lib/utils/textConverter";

interface BrandSliderProps {
	brands: {
		enable: boolean;
		title?: string;
		logos: string[];
	};
}

const BrandSlider = ({ brands }: BrandSliderProps) => {

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
			
		</div>
	);
};

export default BrandSlider;
