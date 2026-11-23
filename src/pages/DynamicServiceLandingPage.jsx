import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, HeartPulse, Home } from "lucide-react";

import {
  useService,
  getServiceTypes,
  typeSlug,
  mediaUrl,
} from "../api/services";

import appointmentsWave from "../assets/appointments-wave.jpg";

/* ---------------- SERVICE TYPE CARD ---------------- */

function ServiceTypeCard({ item, link, index }) {
  const image = mediaUrl(item.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white shadow-[0_4px_18px_rgba(38,60,48,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(38,60,48,0.12)]"
    >
      <Link
        to={link}
        className="relative block h-[210px] w-full overflow-hidden bg-[#edf3ed] sm:h-[235px]"
      >
        {image ? (
          <img
            src={image}
            alt={item.heading}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#e8f0e8] to-[#dce9df]">
            <HeartPulse size={58} strokeWidth={1.3} className="text-[#476b55]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e382c]/30 to-transparent" />
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-bold leading-snug text-[#263c30] transition-colors group-hover:text-[#A34116] sm:text-xl">
          {item.heading}
        </h3>

        <p className="mt-3 line-clamp-4 flex-1 text-[15px] leading-7 text-[#333434] sm:text-[16px]">
          {item.description ||
            `Learn more about ${item.heading} and the care options available at RENOVA.`}
        </p>

        <Link
          to={link}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#304b3c] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#963D16]"
        >
          Know More
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </motion.article>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function DynamicServiceLandingPage() {
  const { serviceSlug } = useParams();
  const { service, loading, error } = useService(serviceSlug);

  const serviceName = service?.name || "Our Services";
  const serviceDescription = service?.description || "";
  // backend field name is icon_image
  const serviceImage = mediaUrl(service?.icon_image);
  const types = getServiceTypes(service);

  // always use the real slug from backend (handles cancer -> cancer-types)
  const baseSlug = service?.slug || serviceSlug;

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
        style={{ backgroundImage: `url(${appointmentsWave})` }}
      >
        <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
          <ol className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
            <li>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 font-semibold text-white drop-shadow-md transition hover:text-[#ffb18b]"
              >
                <Home size={15} />
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-white">/</li>
            <li>
              <Link
                to="/services"
                className="font-semibold text-white drop-shadow-md transition hover:text-[#ffb18b]"
              >
                Services
              </Link>
            </li>
            <li aria-hidden="true" className="text-white">/</li>
            <li aria-current="page" className="font-bold text-white drop-shadow-md">
              {serviceName}
            </li>
          </ol>
        </div>
      </nav>

      {/* LOADING */}
      {loading && (
        <div className="flex min-h-[350px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#dce9df] border-t-[#476b55]" />
            <p className="mt-4 text-sm text-[#476b55]">Loading...</p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <section className="py-20 text-center">
          <h1 className="text-2xl font-bold text-[#263c30]">Unable to load service</h1>
          <p className="mt-3 text-[#555]">Please try again later.</p>
          <Link
            to="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#304b3c] px-6 py-3 text-white hover:bg-[#963D16]"
          >
            Back to Services
            <ArrowRight size={16} />
          </Link>
        </section>
      )}

      {!loading && !error && (
        <>
          {/* INTRO: IMAGE LEFT, TEXT RIGHT */}
          <section className="bg-white py-12 sm:py-16 lg:py-20">
            <div className="page-container px-4 sm:px-6 lg:px-8">
              <div
                className={`grid items-center gap-10 ${
                  serviceImage ? "lg:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {serviceImage && (
                  <motion.div
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-2xl"
                  >
                    <img
                      src={serviceImage}
                      alt={serviceName}
                      className="h-[280px] w-full object-cover sm:h-[380px] lg:h-[440px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#263c30]/15 to-transparent" />
                  </motion.div>
                )}

                <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#476b55]/20 bg-[#f4f7f2] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#476b55]">
                    <HeartPulse size={15} />
                    RENOVA Cancer Hospital
                  </span>

                  <h1 className="text-3xl font-bold leading-tight text-[#263c30] sm:text-4xl lg:text-[44px]">
                    {serviceName}
                  </h1>

                  {serviceDescription && (
                    <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#333434] sm:text-lg">
                      {serviceDescription}
                    </p>
                  )}

                  <Link
                    to="/appointments"
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#304b3c] px-6 py-3 font-semibold text-white transition hover:bg-[#963D16]"
                  >
                    Book an Appointment
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SERVICE TYPE CARDS */}
          <section className="bg-[#f4f7f2] py-14 sm:py-16 lg:py-[76px]">
            <div className="page-container px-4 sm:px-6 lg:px-8">
              {types.length > 0 ? (
                <>
                  <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#476b55]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#476b55]">
                      <HeartPulse size={15} />
                      Explore Our Services
                    </span>
                    <h2 className="text-2xl font-bold leading-tight text-[#263c30] sm:text-3xl lg:text-[36px]">
                      {serviceName}
                    </h2>
                    <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#963D16]" />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {types.map((item, index) => (
                      <ServiceTypeCard
                        key={`${item.heading}-${index}`}
                        item={item}
                        index={index}
                        link={`/services/${baseSlug}/${typeSlug(item)}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-6 text-center">
                  <h2 className="text-2xl font-bold text-[#263c30]">{serviceName}</h2>
                  <p className="mt-4 text-[#555]">Service details will be updated soon.</p>
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-[#263c30] py-12 sm:py-14">
            <div className="page-container flex flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Need Help Choosing the Right Care?
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
                  Connect with our team to learn more about {serviceName} and find the right next step for your care.
                </p>
              </div>
              <Link
                to="/appointments"
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#963D16] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#d96836]"
              >
                Book an Appointment
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}