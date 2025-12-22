import DonationForm from "@/components/DonationForm";

export const metadata = {
    title: "Donation Confirmation",
    description: "Confirm your donation amount and proceed with payment.",
};

const DonationPage = () => {
    return (
        <>
            <section className="page-header bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24">
                <div className="container px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-bold text-[#034833] mb-4 aos-init aos-animate" data-aos="fade-up">
                            Donate Now
                        </h1>
                        <p className="text-gray-600 text-lg md:text-xl aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                            Your contribution helps us perform our regular activities and provide support to those in need.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section py-16">
                <div className="container px-4">
                    <div className="row justify-center">
                        <div className="col-12 lg:col-8">
                            <DonationForm />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DonationPage;
