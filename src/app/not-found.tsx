
import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";

export default function Custom404() {
  return (
    <section className="section-lg text-center">
      <div className="container section-lg pt-0">
        <div
          className="row justify-center"
          data-aos="fade-up-sm"
          data-aos-delay="150"
        >
          <div className="sm:col-10 md:col-8 lg:col-6">
            <ImageFallback
              src="/images/404.png"
              alt="404"
              width={120}
              height={120}
              className="mx-auto mb-10"
              priority
            />
            <h1 className="h2 mb-4">Sorry! Page not found</h1>
            <div className="content">
              <p>
                It looks like the page you’re looking for doesn’t exist or
                might have been moved. don’t worry, let’s get you back on
                track!
              </p>
            </div>
            <Link
              data-aos="zoom-in-sm"
              data-aos-delay="300"
              href="/"
              className="btn btn-primary mt-6"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}