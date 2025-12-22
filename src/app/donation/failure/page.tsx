"use client";

import Link from "next/link";
import { FaTimesCircle, FaRedo, FaEnvelope } from "react-icons/fa";

const DonationFailurePage = () => {
    return (
        <section className="py-20 md:py-32 bg-gray-50 min-h-[70vh] flex items-center">
            <div className="container px-4">
                <div className="text-center max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="mb-6 flex justify-center">
                        <FaTimesCircle className="text-red-500 text-7xl" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We were unable to process your donation at this time.
                    </p>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        This could be due to a network issue, a declined transaction, or a cancellation. No funds have been deducted. Please try again or contact us if the issue persists.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/donation/confirm"
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#0c79c0] text-white rounded-full font-semibold hover:bg-[#0a68a6] transition-colors shadow-lg shadow-blue-200"
                        >
                            <FaRedo /> Try Again
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                        >
                            <FaEnvelope /> Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DonationFailurePage;
