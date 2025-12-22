"use client";

import { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";

const currencyOptions = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "AUD", label: "AUD ($)" },
    { value: "INR", label: "INR (₹)" },
];

const DonationForm = () => {
    const router = useRouter();
    const [amount, setAmount] = useState<string>("10.00");
    const [currency, setCurrency] = useState<string>("USD");
    const [customAmount, setCustomAmount] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const predefinedAmounts = ["10.00", "25.00", "50.00", "100.00"];

    // Dynamic PayPal currency: mapping INR to USD for processing
    const paypalCurrency = currency === "INR" ? "USD" : currency;

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
                if (data.currency) {
                    const found = currencyOptions.find(c => c.value === data.currency);
                    if (found) {
                        setCurrency(data.currency);
                    }
                }
            })
            .catch(err => console.error("Could not fetch IP info", err));
    }, []);

    const handleAmountChange = (val: string) => {
        setAmount(val);
        setCustomAmount(false);
    };

    return (
        <div className="bg-white p-6 md:p-8 shadow-xl rounded-2xl border border-gray-100 max-w-lg mx-auto transform transition-all">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Make a Donation</h3>

            {/* Amount Selection */}
            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Select Amount</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {predefinedAmounts.map((amt) => (
                        <button
                            key={amt}
                            type="button"
                            onClick={() => handleAmountChange(amt)}
                            className={`py-2 px-4 rounded-lg border text-sm font-bold transition-all duration-200 ${!customAmount && amount === amt
                                ? "bg-[#0c79c0] text-white border-[#0c79c0] shadow-md transform scale-105"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#0c79c0] hover:text-[#0c79c0]"
                                }`}
                        >
                            {currency} {amt}
                        </button>
                    ))}
                </div>

                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold group-focus-within:text-[#0c79c0] transition-colors">
                        {currency}
                    </span>
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setCustomAmount(true);
                        }}
                        onFocus={() => setCustomAmount(true)}
                        placeholder="Custom Amount"
                        className={`w-full pl-16 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#0c79c0] focus:border-transparent outline-none transition-all ${customAmount ? "border-[#0c79c0] ring-1 ring-[#0c79c0]" : "border-gray-200 bg-gray-50"
                            }`}
                    />
                </div>
            </div>

            {/* Currency Selection */}
            <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">Currency</label>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#0c79c0] focus:border-transparent outline-none bg-white cursor-pointer hover:border-[#0c79c0] transition-colors"
                >
                    {currencyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                    * Currency availability depends on your region and PayPal settings.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 border border-red-100 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    {error}
                </div>
            )}

            {/* PayPal Button */}
            <div className="relative z-0 min-h-[150px]">
                <PayPalScriptProvider
                    key={paypalCurrency}
                    options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "sb",
                        currency: paypalCurrency,
                        intent: "capture"
                    }}
                >
                    <PayPalButtons
                        style={{ layout: "vertical", shape: "rect", label: "donate", height: 45 }}
                        forceReRender={[amount, currency]}
                        createOrder={async (data, actions) => {
                            let processAmount = amount;
                            let processCurrency = currency;
                            let description = `Donation to CARD - ${amount} ${currency}`;

                            // Handle INR conversion
                            if (currency === 'INR') {
                                try {
                                    const res = await fetch('https://hexarate.paikama.co/api/rates/INR/USD/latest');
                                    const rateData = await res.json();

                                    if (rateData.status_code === 200 && rateData.data && rateData.data.mid) {
                                        const mid = rateData.data.mid;
                                        const usdValue = parseFloat(amount) * mid;
                                        processAmount = usdValue.toFixed(2);
                                        processCurrency = 'USD';
                                        description = `Donation to CARD - ${amount} INR (~${processAmount} USD)`;
                                    } else {
                                        throw new Error("Currency conversion failed");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    setError("Currency conversion unavailable. Please try USD.");
                                    throw err;
                                }
                            }

                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: processAmount,
                                            currency_code: processCurrency
                                        },
                                        description: description
                                    },
                                ],
                                intent: "CAPTURE"
                            });
                        }}
                        onApprove={async (data, actions) => {
                            if (actions.order) {
                                return actions.order.capture().then((details) => {
                                    const name = details.payer?.name?.given_name || 'Donor';
                                    router.push(`/donation/success?amount=${amount}&currency=${currency}&name=${encodeURIComponent(name)}`);
                                });
                            }
                            return Promise.resolve();
                        }}
                        onError={(err) => {
                            console.error("PayPal Error:", err);
                            setError("Something went wrong with the payment transaction. Please try again.");
                        }}
                    />
                </PayPalScriptProvider>
            </div>

            <div className="mt-6 text-center border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400">
                    Secure payment via PayPal. Your support makes a difference!
                </p>
            </div>
        </div>
    );
};

export default DonationForm;
