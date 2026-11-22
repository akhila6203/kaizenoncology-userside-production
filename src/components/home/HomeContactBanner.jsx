
import { Link } from "react-router-dom";

export default function HomeContactBanner() {
  return (
    <section aria-label="Contact and appointment options" className="section-padding">
      <div className="page-container overflow-hidden rounded-[32px] bg-gradient-to-r from-navy to-royal px-6 py-12 text-center text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">

        {/* Heading */}
        <div className="mx-auto max-w-4xl">
         <p className="text-sm font-bold tracking-[0.2em] text-white sm:text-[15px]"> 
            WE'RE HERE TO HELP
          </p>

          <h2 className="display-font mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Your Cancer Care Journey Starts Here
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-7 text-white/90 sm:text-base sm:leading-8 lg:text-[17px]">
            Whether you are concerned about a symptom, have recently received
            a diagnosis, are exploring treatment options or want another
            specialist opinion, our team can help you understand the next step.
          </p>
        </div>

        {/* Three Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">

          <Link
            to="/appointments"
            className="btn-light inline-flex min-h-[48px] w-full items-center justify-center px-7 sm:w-auto"
          >
            Book an Appointment
          </Link>

          <Link
            to="/doctors"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/50 px-7 py-3 text-center text-[15px] font-semibold text-white transition-all duration-300 hover:border-[#963D16] hover:bg-[#963D16] hover:text-white sm:w-auto"
          >
            Find a Doctor
          </Link>

          <Link
            to="/contact"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/50 px-7 py-3 text-center text-[15px] font-semibold text-white transition-all duration-300 hover:border-[#963D16] hover:bg-[#963D16] hover:text-white sm:w-auto"
          >
            Contact Us
          </Link>

        </div>
      </div>
    </section>
  );
}










