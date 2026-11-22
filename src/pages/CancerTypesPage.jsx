
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
} from "lucide-react";

import {
  cancerTypes,
  cancerOverview,
} from "../data/cancerTypeContent";

import appointmentsWave from "../assets/appointments-wave.jpg";

function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
      style={{
        backgroundImage: `url(${appointmentsWave})`,
      }}
    >
      <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
        <ol className="flex flex-wrap items-center gap-2 text-[15px] sm:text-base">
          <li>
            <Link
              to="/"
              className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#E87744]"
            >
              Home
            </Link>
          </li>

          <li aria-hidden="true" className="text-white/90 drop-shadow-md">
            /
          </li>

          <li
            aria-current="page"
            className="font-bold text-white drop-shadow-md"
          >
            Cancer Types
          </li>
        </ol>
      </div>
    </nav>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  center = true,
}) {
  return (
    <div
      className={`mx-auto w-full max-w-3xl ${
        center ? "text-center" : "text-left"
      }`}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#E87744]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-3xl font-bold leading-tight text-[#263C30] sm:text-4xl lg:text-[42px]">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-5 max-w-3xl text-[17px] leading-8 text-[#536357] sm:text-[18px]">
          {description}
        </p>
      )}
    </div>
  );
}

export default function CancerTypesPage() {
  return (
    <main className="overflow-x-clip bg-[#fffdf9]">

      {/* BREADCRUMB */}
      <Breadcrumb />


      {/* WHAT IS CANCER */}
      <section className="page-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          eyebrow="Cancer awareness"
          title={cancerOverview.title}
          description="Understanding cancer is an important first step towards making informed decisions about your health and care."
        />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[26px] shadow-lg">
              <img
                src={cancerOverview.image}
                alt={cancerOverview.imageAlt}
                className="h-[300px] w-full object-cover transition duration-700 hover:scale-105 sm:h-[430px]"
                loading="lazy"
              />
            </div>

            <div className="absolute -bottom-5 left-5 rounded-2xl bg-white p-4 shadow-lg sm:left-8">
              <div className="flex items-center gap-3">
                <HeartPulse size={28} className="text-[#E87744]" />
                <div>
                  <p className="font-bold text-[#263C30]">
                    Knowledge matters
                  </p>
                  <p className="text-sm text-[#536357]">
                    Understand your health
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold leading-snug text-[#263C30] sm:text-3xl">
              Understanding the Condition
            </h3>

            <p className="mt-5 text-[17px] leading-8 text-[#4a4d4b] sm:text-[18px]">
              {cancerOverview.description}
            </p>

            <p className="mt-5 text-[17px] leading-8 text-[#4a4d4b] sm:text-[18px]">
              {cancerOverview.secondParagraph}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E5EDE4] bg-[#F5F8F3] p-5">
                <BookOpen className="mb-3 text-[#476B55]" size={28} />

                <h3 className="text-lg font-bold text-[#263C30]">
                  Understand
                </h3>

                <p className="mt-2 text-base leading-7 text-[#343535]">
                  Learn about cancer types, symptoms and diagnosis.
                </p>
              </div>

              <div className="rounded-2xl border border-[#F3E5DA] bg-[#FFF8F2] p-5">
                <ShieldCheck className="mb-3 text-[#E87744]" size={28} />

                <h3 className="text-lg font-bold text-[#263C30]">
                  Make Informed Decisions
                </h3>

                <p className="mt-2 text-base leading-7 text-[#323232]">
                  Understand possible treatment and prevention options.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CANCER TYPES */}
      <section
        id="cancer-types"
        className="scroll-mt-28 bg-[#F4F7F2] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="page-container">

          <SectionHeading
            eyebrow="Explore by condition"
            title="Find Care by Cancer Type"
            description="Every cancer type is different. Explore the information below to learn about possible symptoms, diagnostic tests, risk factors and available treatment approaches."
          />

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {cancerTypes.map((cancer, index) => (
              <motion.article
                key={cancer.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                }}
                className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#E4EAE1] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={cancer.image}
                    alt={cancer.imageAlt}
                    className="h-[230px] w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  <span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wider text-[#476B55] shadow-sm">
                    {cancer.category || "CANCER TYPE"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-2 sm:p-3">

                  <h3 className="text-center text-[23px] font-bold leading-snug text-[#263C30]">
                    {cancer.title}
                  </h3>

                  <p className="mt-4 flex-1 text-center text-[16px] leading-7 text-[#536357] sm:text-[18px]">
                    {cancer.cardDescription}
                  </p>

                  <div className="mt-7 flex justify-center">
                    <Link
                      to={`/services/cancer/${cancer.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#304B3C] px-5 py-2 text-base font-bold text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-[#E87744] hover:shadow-md"
                    >
                      Know More
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR NEXT STEP */}
      <section className="page-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[28px] bg-[#304B3C] px-6 py-10 text-white shadow-xl sm:px-10 sm:py-14 lg:px-14"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          
<div className="relative grid items-center gap-6 text-center lg:grid-cols-[1fr_auto] lg:gap-8 lg:text-left"> 
   <div className="flex flex-col items-center lg:items-start">
    <p className="inline-block rounded-full bg-white/15 px-4 py-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#FFD0B3]">
      Your Next Step
    </p>

    <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-[42px]">
      Every Cancer Journey Is Different
    </h2>

    <p className="mt-5 max-w-2xl text-[16px] font-medium leading-7 text-white sm:text-[18px] sm:leading-8">
      Understanding your condition and available treatment options
      is an important part of making informed healthcare decisions.
      Every patient's needs are different. Speak with a specialist
      to discuss your diagnosis, concerns and possible next steps.
    </p>
  </div>

  <div className="flex justify-center lg:justify-end">
    <Link
      to="/appointments"
      className="inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-[#E87744] px-4 py-2.5 text-[13px] font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-[#D96835] sm:min-h-[54px] sm:gap-3 sm:px-7 sm:py-4 sm:text-base"
    >
      <Stethoscope size={17} className="shrink-0 sm:h-5 sm:w-5" />
      <span className="whitespace-nowrap">Book an Appointment</span>
      <ArrowRight size={17} className="shrink-0 sm:h-[19px] sm:w-[19px]" />
    </Link>
  </div>
</div>

        </motion.div>
      </section>

      {/* MEDICAL DISCLAIMER */}
      {/* <section className="page-container px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#E6EBE3] bg-white p-5 sm:p-6">
          <p className="text-[15px] leading-7 text-[#536357]">
            <strong className="text-[#304B3C]">
              Medical information:
            </strong>{" "}
            Information on this website is intended for general education and
            awareness. It does not replace consultation, diagnosis or
            treatment by a qualified healthcare professional. If you have
            new, persistent or concerning symptoms, seek medical evaluation.
          </p>
        </div>
      </section> */}
    </main>
  );
}
