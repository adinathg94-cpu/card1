"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaHome, FaEnvelope } from "react-icons/fa6";
import SeoMeta from "@/partials/SeoMeta";

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [donationDetails, setDonationDetails] = useState<{
    amount: number;
    email: string;
  } | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Verify payment with backend
      fetch(`/api/donation/verify-session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDonationDetails(data.donation);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  return (
    <>
      <SeoMeta
        title="Donation Successful"
        description="Thank you for your donation"
      />
      <section className="section-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-6 md:col-8 col-10">
              <div className="bg-dark/2 p-10 rounded-2xl text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCheckCircle className="text-5xl text-green-600" />
                  </div>
                </div>

                <h1 className="h3 mb-4 font-semibold text-green-600">
                  Thank You for Your Donation!
                </h1>

                <p className="mb-6 text-lg">
                  Your generous contribution helps us make a real difference in communities around the world.
                </p>

                {isLoading ? (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">Verifying your payment...</p>
                  </div>
                ) : donationDetails ? (
                  <div className="mb-6 p-6 bg-body rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Donation Amount</p>
                    <p className="text-3xl font-bold text-primary">
                      ${(donationDetails.amount / 100).toFixed(2)}
                    </p>
                    {donationDetails.email && (
                      <p className="text-sm text-gray-600 mt-4">
                        A confirmation email has been sent to {donationDetails.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mb-6 p-6 bg-body rounded-lg">
                    <p className="text-sm text-gray-600">
                      Your payment has been processed successfully.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Your donation receipt will be sent to your email address.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link
                      href="/"
                      className="btn btn-primary inline-flex items-center gap-2"
                    >
                      <FaHome />
                      Return to Home
                    </Link>
                    <Link
                      href="/donation/confirm"
                      className="btn btn-outline inline-flex items-center gap-2"
                    >
                      Make Another Donation
                    </Link>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border">
                    <p className="text-sm text-gray-600 mb-4">
                      Questions about your donation?
                    </p>
                    <Link
                      href="/contact"
                      className="btn btn-outline inline-flex items-center gap-2"
                    >
                      <FaEnvelope />
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={
      <section className="section-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-6 md:col-8 col-10">
              <div className="bg-dark/2 p-10 rounded-2xl text-center">
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    }>
      <DonationSuccessContent />
    </Suspense>
  );
}
