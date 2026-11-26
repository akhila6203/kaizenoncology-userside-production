
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CalendarDays,
  HeartPulse,
  ChevronDown,
  Menu,
} from "lucide-react";

import {
  useService,
  getServiceTypes,
  typeSlug,
  mediaUrl,
} from "../api/services";

// import ServicePageContentDetail from "./ServicePageContentDetail";
import appointmentsWave from "../assets/appointments-wave.jpg";

/* ---------------- BREADCRUMB ---------------- */

function Breadcrumb({ serviceName, serviceSlug, pageName }) {
  const linkCls =
    "font-semibold text-white drop-shadow-md transition hover:text-[#ffb18b]";

  return (
    <nav
      aria-label="Breadcrumb"
      className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
      style={{ backgroundImage: `url(${appointmentsWave})` }}
    >
      <div className="page-container relative z-10 px-5 py-3 sm:px-8 lg:px-12">
        <ol className="flex flex-wrap items-center gap-2 text-[15px] sm:text-base">
          <li>
            <Link to="/" className={linkCls}>Home</Link>
          </li>

          <li aria-hidden="true" className="text-white/90">/</li>

          <li>
            <Link to="/services" className={linkCls}>Services</Link>
          </li>

          <li aria-hidden="true" className="text-white/90">/</li>

          <li>
            <Link to={`/services/${serviceSlug}`} className={linkCls}>
              {serviceName}
            </Link>
          </li>

          <li aria-hidden="true" className="text-white/90">/</li>

          <li aria-current="page" className="font-bold text-white drop-shadow-md">
            {pageName}
          </li>
        </ol>
      </div>
    </nav>
  );
}

/* ---------------- RELATED SERVICE CARD ---------------- */

function RelatedServiceCard({ item, link, index }) {
  const image = mediaUrl(item.image);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white shadow-[0_4px_18px_rgba(38,60,48,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(38,60,48,0.12)]"
    >
      <Link
        to={link}
        className="relative block h-[190px] w-full overflow-hidden bg-[#edf3ed] sm:h-[220px]"
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
            <HeartPulse
              size={58}
              strokeWidth={1.3}
              className="text-[#476b55]"
            />
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

/* ---------------- SECTION SIDEBAR ---------------- */

function SectionSidebar({ items, activeSection, onSelect }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = items.find((item) => item.id === activeSection);

  const handleSelect = (id) => {
    onSelect(id);
    setMobileOpen(false);

    const element = document.getElementById(id);

    if (element) {
      const offset = 105;
      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }
  };

  return (
    // <aside className="lg:sticky lg:top-24 lg:self-start">
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)]">
      {/* MOBILE / TABLET DROPDOWN */}
      <div className="relative lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between rounded-2xl border border-[#dfe7df] bg-white px-5 py-4 text-left font-bold text-[#304B3C] shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Menu size={19} />
            {activeItem?.label || "On This Page"}
          </span>

          <ChevronDown
            size={20}
            className={`transition-transform ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {mobileOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-[#dfe7df] bg-white p-2 shadow-xl">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === item.id
                    ? "bg-[#304B3C] text-white"
                    : "text-[#536357] hover:bg-[#F2F6F1]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-[24px] border border-[#E3EAE2] bg-white p-5 shadow-sm lg:block xl:p-6">
      {/* <div className="hidden rounded-[24px] border border-[#E3EAE2] bg-white p-5 shadow-sm lg:block xl:p-6"> */}
        <h3 className="mb-5 text-lg font-bold text-[#263C30]">
          On This Page
        </h3>

        <nav className="space-y-1.5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full rounded-xl px-4 py-3 text-left text-[14px] font-semibold transition-all ${
                activeSection === item.id
                  ? "bg-[#304B3C] text-white"
                  : "text-[#536357] hover:bg-[#F2F6F1] hover:text-[#304B3C]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* SIDEBAR CTA */}
        <div className="mt-6 rounded-2xl bg-[#F3F7F2] p-4">
          <p className="text-sm font-bold text-[#304B3C]">
            Need specialist guidance?
          </p>

          <Link
            to="/appointments"
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#E87744] transition hover:text-[#A34116]"
          >
            Book appointment
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function DynamicServiceDetailPage() {
  const { serviceSlug, pageSlug } = useParams();
  const { service, loading, error } = useService(serviceSlug);

  const [activeSection, setActiveSection] = useState("overview");
  useEffect(() => {
  if (loading || !service) return;

  const sectionIds = [
    "overview",
    ...Array.from(document.querySelectorAll('[id^="point-"]')).map(
      (el) => el.id
    ),
    "related-services",
    "appointment",
  ];

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            a.boundingClientRect.top - b.boundingClientRect.top
        );

      if (visibleSections.length > 0) {
        setActiveSection(visibleSections[0].target.id);
      }
    },
    {
      root: null,
      rootMargin: "-120px 0px -65% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));

  return () => observer.disconnect();
}, [loading, service, pageSlug]);

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#fffdf9]">
        <div className="flex flex-col items-center justify-center py-24 text-center text-[#476B55]">
          <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#dce5da] border-t-[#476B55]" />
          <p className="font-semibold">Loading details...</p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-[60vh] bg-[#fffdf9] px-5 py-20 text-center">
        <h1 className="text-3xl font-bold text-[#263C30] sm:text-4xl">
          Content unavailable
        </h1>

        <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#536357]">
          This page may be inactive, removed or not published yet.
        </p>

        <Link
          to="/services"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#304B3C] px-6 py-3 font-bold text-white transition hover:bg-[#963D16]"
        >
          Back to services
          <ArrowRight size={17} />
        </Link>
      </main>
    );
  }

  const types = getServiceTypes(service);
  const type = types.find((t) => typeSlug(t) === pageSlug);

  // Not a service type -> old Service Pages content
  if (!type) {
    // If your old detail page component is still used, uncomment:
    // return <ServicePageContentDetail />;

    return (
      <main className="min-h-[50vh] bg-[#fffdf9] px-5 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#263C30]">
          Content unavailable
        </h2>

        <Link
          to={`/services/${serviceSlug}`}
          className="mt-5 inline-flex items-center gap-2 font-bold text-[#476B55]"
        >
          Back to {service.name}
        </Link>
      </main>
    );
  }

  const baseSlug = service.slug || serviceSlug;
  const image = mediaUrl(type.image);

  const points = (type.points || []).filter(
    (p) => p.heading || p.description
  );

  const others = types.filter((t) => typeSlug(t) !== pageSlug);

  /* SIDEBAR NAVIGATION ITEMS */

  const sidebarItems = [
    { id: "overview", label: "Overview" },
    ...points.map((p, i) => ({
      id: `point-${i}`,
      label: p.heading || `Section ${i + 1}`,
    })),
    ...(others.length > 0
      ? [{ id: "related-services", label: "Explore More" }]
      : []),
    { id: "appointment", label: "Book Appointment" },
  ];

  return (
    <main className="overflow-x-clip bg-[#fffdf9] text-[#263C30]">
      {/* BREADCRUMB */}
      <Breadcrumb
        serviceName={service.name}
        serviceSlug={baseSlug}
        pageName={type.heading}
      />

      {/* FIRST SECTION - SAME AS BEFORE */}
      <section className="page-container px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div
          className={`grid items-center gap-9 lg:gap-14 ${
            image ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mx-auto w-full max-w-[650px]"
            >
              <img
                src={image}
                alt={type.heading}
                className="h-[280px] w-full rounded-[28px] object-cover shadow-xl sm:h-[400px] lg:h-[450px]"
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex rounded-full bg-[#F1F6F0] px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-[#476B55]">
              {service.name}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-[#263C30] sm:text-4xl lg:text-[44px]">
              {type.heading}
            </h1>

            {type.description && (
              <p className="mt-6 whitespace-pre-line text-[17px] leading-8 text-[#141414] sm:text-[19px]">
                {type.description}
              </p>
            )}

            {/* MOBILE BUTTONS SIDE BY SIDE */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:justify-center lg:justify-start">
              {points.length > 0 && (
                <a
                  href="#details"
                  onClick={() => setActiveSection("point-0")}
                  className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[#304B3C] px-3 py-3 text-center text-xs font-bold text-white transition hover:bg-[#963D16] sm:gap-2 sm:px-5 sm:text-sm"
                >
                  Explore details
                  <ArrowRight size={16} className="shrink-0" />
                </a>
              )}

              <Link
                to="/appointments"
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-[#476B55] px-3 py-3 text-center text-xs font-bold text-[#304B3C] transition hover:bg-[#304B3C] hover:text-white sm:gap-2 sm:px-5 sm:text-sm"
              >
                <CalendarDays size={16} className="shrink-0" />
                Book appointment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DETAILS WITH STICKY SIDEBAR */}
      <section
        id="details"
        className="scroll-mt-24  bg-[#fffdf9] px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      >
        <div className="page-container grid grid-cols-1 gap-7 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* LEFT SIDEBAR */}
          <SectionSidebar
            items={sidebarItems}
            activeSection={activeSection}
            onSelect={setActiveSection}
          />

          {/* RIGHT CONTENT */}
          <div className="min-w-0">
            {/* OVERVIEW */}
            <section id="overview" className="mb-12 scroll-mt-28">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#263C30] sm:text-3xl lg:text-4xl">
                  Overview of {type.heading}
                </h2>
              </div>

              {type.description && (
                <div className="rounded-[24px] border border-[#E4EAE1] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                  <p className="whitespace-pre-line text-[16px] leading-8 text-[#263C30] sm:text-[17px] lg:text-[18px]">
                    {type.description}
                  </p>
                </div>
              )}
            </section>

            {/* DYNAMIC POINT SECTIONS */}
            {points.map((p, i) => (
              <motion.section
                key={i}
                id={`point-${i}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4 }}
                className="mb-12 scroll-mt-28"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold leading-tight text-[#263C30] sm:text-3xl lg:text-4xl">
                    {p.heading}
                  </h2>
                </div>

                <div className="rounded-[24px] border border-[#E4EAE1] bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                  <p className="whitespace-pre-line text-[16px] leading-8 text-[#263C30] sm:text-[17px] lg:text-[18px]">
                    {p.description}
                  </p>
                </div>
              </motion.section>
            ))}

            {/* EXPLORE MORE - LANDING PAGE STYLE CARDS */}
            {others.length > 0 && (
              <section
                id="related-services"
                className="mb-12 scroll-mt-28"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold leading-tight text-[#263C30] sm:text-3xl lg:text-4xl">
                    Explore More in {service.name}
                  </h2>

                  <div className="mt-3 h-1 w-14 rounded-full bg-[#963D16]" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {others.map((item, index) => (
                    <RelatedServiceCard
                      key={`${item.heading}-${index}`}
                      item={item}
                      index={index}
                      link={`/services/${baseSlug}/${typeSlug(item)}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* APPOINTMENT CTA */}
            <section
              id="appointment"
              className="scroll-mt-28 rounded-[24px] bg-[#263C30] p-6 text-white sm:p-9 lg:p-10"
            >
              <h2 className="text-2xl font-bold sm:text-3xl">
                Need guidance about {type.heading}?
              </h2>

              <p className="mt-3 text-base leading-7 text-white/80 sm:text-lg">
                Our team can help you understand the information and discuss your care options.
              </p>

              <Link
                to="/appointments"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#963D16] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#D96835] sm:text-base"
              >
                Book an Appointment
                <ArrowRight size={17} />
              </Link>
            </section>

            {/* BACK LINK */}
            <div className="py-8">
              <Link
                to={`/services/${baseSlug}`}
                className="inline-flex items-center gap-2 font-bold text-[#476B55] transition hover:text-[#A34116]"
              >
                ← Back to {service.name}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

