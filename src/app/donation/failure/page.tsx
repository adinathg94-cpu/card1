"use client";

import Link from "next/link";
import { FaExclamationCircle, FaHome, FaRedo } from "react-icons/fa6";
import SeoMeta from "@/partials/SeoMeta";

export default function DonationFailurePage() {
  return (
    <>
      <SeoMeta
        title="Donation Cancelled"
        description="Your donation was not completed"
      />
      <section className="section-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-6 md:col-8 col-10">
              <div className="bg-dark/2 p-10 rounded-2xl text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                    <FaExclamationCircle className="text-5xl text-red-600" />
                  </div>
                </div>

                <h1 className="h3 mb-4 font-semibold text-red-600">
                  Payment Not Completed
                </h1>

                <p className="mb-6 text-lg">
                  Your donation was not completed. This could be because you cancelled the payment or an error occurred.
                </p>

                <div className="mb-6 p-6 bg-body rounded-lg">
                  <p className="text-sm text-gray-600">
                    No charges were made to your payment method. If you experienced any issues, please try again or contact us for assistance.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link
                    href="/donation/confirm"
                    className="btn btn-primary inline-flex items-center gap-2"
                  >
                    <FaRedo />
                    Try Again
                  </Link>
                  <Link
                    href="/"
                    className="btn btn-outline inline-flex items-center gap-2"
                  >
                    <FaHome />
                    Return to Home
                  </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-gray-600 mb-4">
                    Need help with your donation?
                  </p>
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    Contact our support team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
