"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import config from "@/config/config.json";
import SeoMeta from "@/partials/SeoMeta";

export default function DonationConfirmPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomAmount, setShowCustomAmount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setAmount(value);
    setShowCustomAmount(value === "custom");
    if (value !== "custom") {
      setCustomAmount("");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const donationAmount = showCustomAmount ? customAmount : amount;

      if (!donationAmount || parseFloat(donationAmount) <= 0) {
        setError("Please enter a valid donation amount");
        setIsLoading(false);
        return;
      }

      // Create checkout session
      const response = await fetch("/api/donation/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(donationAmount) * 100, // Convert to cents
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <SeoMeta
        title="Confirm Your Donation"
        description="Confirm your donation amount and proceed to payment"
      />
      <section className="section-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-6 md:col-8 col-10">
              <div className="bg-dark/2 p-10 rounded-2xl">
                <h2 className="h4 mb-2 font-semibold text-center">
                  Confirm Your Donation
                </h2>
                <p className="text-center mb-8">
                  Thank you for your generosity! Please select or enter the amount you would like to donate.
                </p>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="mb-6">
                    <label htmlFor="donation-amount" className="form-label">
                      Choose your donation amount <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="donation-amount"
                      className="form-input cursor-pointer text-2xl"
                      required
                      value={amount}
                      onChange={handleAmountChange}
                    >
                      <option value="" disabled>
                        Select an amount
                      </option>
                      <option value="10">$10</option>
                      <option value="25">$25</option>
                      <option value="50">$50</option>
                      <option value="100">$100</option>
                      <option value="250">$250</option>
                      <option value="500">$500</option>
                      <option value="custom">Custom Amount</option>
                    </select>

                    {showCustomAmount && (
                      <div className="mt-4">
                        <label htmlFor="custom-amount" className="form-label">
                          Enter custom amount (USD) <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="custom-amount"
                          type="number"
                          min="1"
                          step="0.01"
                          className="form-input text-2xl"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                          required={showCustomAmount}
                        />
                      </div>
                    )}

                    {amount && !showCustomAmount && (
                      <p className="mt-4 text-lg font-semibold">
                        Donation Amount: ${amount}
                      </p>
                    )}

                    {showCustomAmount && customAmount && (
                      <p className="mt-4 text-lg font-semibold">
                        Donation Amount: ${customAmount}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="btn btn-outline flex-1"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Proceed to Payment"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
