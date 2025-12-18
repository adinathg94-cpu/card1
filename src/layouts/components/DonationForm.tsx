"use client";

import { ChangeEvent, useState } from "react";

interface DonationFormProps {
	description: string;
	contactFormAction: string;
}

const DonationForm: React.FC<DonationFormProps> = ({ description, contactFormAction }) => {
	const [showCustomAmount, setShowCustomAmount] = useState(false);
	const [customAmount, setCustomAmount] = useState("");

	const handleDonationChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;
		setShowCustomAmount(value === "custom");
		if (value !== "custom") {
			setCustomAmount("");
		}
	};

	return (
		<div className="bg-dark/2 p-10 rounded-2xl">
			<h6 className="h4 mb-2 font-semibold">Donation Form</h6>
			<p>{description}</p>
			<form className="mt-8" action={contactFormAction} method="POST">
				<div className="mb-6">
					<label htmlFor="name" className="form-label">
						Your Full Name <span>*</span>
					</label>
					<input
						id="name"
						name="name"
						className="form-input"
						placeholder="John Doe"
						type="text"
						required
					/>
				</div>
				<div className="mb-6">
					<label htmlFor="email" className="form-label">
						Your Email <span>*</span>
					</label>
					<input
						id="email"
						name="email"
						className="form-input"
						placeholder="john.doe@email.com"
						type="email"
						required
					/>
				</div>
				<div className="mb-6">
					<label className="form-label" htmlFor="donation">
						Choose your donation amount <span>*</span>
					</label>
					<select
						id="donation"
						name="donation"
						className="form-input cursor-pointer text-2xl"
						required
						defaultValue="25"
						onChange={handleDonationChange}
					>
						<option value="" disabled>
							Select an amount
						</option>
						<option value="10">$10</option>
						<option value="25">$25</option>
						<option value="50">$50</option>
						<option value="100">$100</option>
						<option value="custom">Custom Amount</option>
					</select>

					{/* Custom amount input (hidden by default) */}
					{showCustomAmount && (
						<input
							id="custom-amount"
							name="custom_amount"
							className="form-input mt-4 text-2xl"
							type="number"
							min="1"
							value={customAmount}
							onChange={(e) => setCustomAmount(e.target.value)}
							placeholder="Enter custom amount"
							required
						/>
					)}
				</div>
				<button type="submit" className="btn btn-primary w-full text-center">
					Donate Now
				</button>
			</form>
		</div>
	);
};

export default DonationForm;
