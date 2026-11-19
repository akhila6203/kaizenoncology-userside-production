
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section-padding flex min-h-[65vh] items-center justify-center bg-white px-5">
      <div className="page-container w-full">
        <div className="mx-auto max-w-2xl py-12 text-center sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-[3px] text-royal">
            404 · Page Not Found
          </p>

          <h1 className="display-font mt-4 text-3xl font-semibold leading-tight text-heading sm:text-4xl md:text-5xl">
            Oops! Page Not Found.
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-7 text-ink sm:text-base">
            The page you are looking for does not exist or may have been moved.
            Please check the URL or return to our homepage.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center"
            >
              Back to Home
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-royal px-6 py-3 text-[15px] font-semibold text-royal transition hover:bg-royal hover:text-white"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

