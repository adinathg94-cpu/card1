"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface DonationFormProps {
	description: string;
	contactFormAction: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ description, contactFormAction }) => {
	const router = useRouter();

	return (
		<div className="bg-dark/2 p-10 rounded-2xl">
			<h6 className="h4 mb-2 font-semibold">Donation Form</h6>
			<p>{description}</p>
			<div className="mt-8">
				<p className="mb-6 text-sm text-gray-600">
					Click the button below to proceed with your donation. You'll be able to select your donation amount and complete the payment securely.
				</p>
				<Link
					href="/donation/confirm"
					className="btn btn-primary w-full text-center"
				>
					Donate Now
				</Link>
			</div>
		</div>
	);
};

export default DonationForm;
