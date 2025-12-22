"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaCheckCircle, FaArrowLeft, FaHome } from "react-icons/fa";
import { Suspense } from "react";

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency");
    const name = searchParams.get("name");

    return (
        <div className="text-center max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-6 flex justify-center">
                <FaCheckCircle className="text-green-500 text-7xl animate-bounce" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Thank You{name ? `, ${name}` : ""}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Your donation of <span className="font-bold text-green-600">{currency} {amount}</span> was successful.
            </p>
            <p className="text-gray-500 mb-8 leading-relaxed">
                We deeply appreciate your support. Because of you, we can continue to make a real difference. A receipt has been sent to your email.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-[#0c79c0] text-white rounded-full font-semibold hover:bg-[#0a68a6] transition-colors shadow-lg shadow-blue-200"
                >
                    <FaHome /> Back to Home
                </Link>
                <Link
                    href="/about"
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                    <FaArrowLeft /> Learn More About Us
                </Link>
            </div>
        </div>
    );
}

const DonationSuccessPage = () => {
    return (
        <section className="py-20 md:py-32 bg-gray-50 min-h-[70vh] flex items-center">
            <div className="container px-4">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <SuccessContent />
                </Suspense>
            </div>
        </section>
    );
};

export default DonationSuccessPage;
