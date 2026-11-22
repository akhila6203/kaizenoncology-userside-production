
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle";
import WaveDivider from "../WaveDivider";

import breastCare1 from "../../assets/home/breastCare1.jpg";
import diagnosisImage from "../../assets/home/diagnosis.jpg";
import treatmentImage from "../../assets/home/treatmentBanner3.jpg";
import recoveryImage from "../../assets/home/patient-support.jpg";

const programmeStages = [
  {
    code: "DIAGNOSIS & ASSESSMENT 01",
    label: "DIAGNOSTIC SERVICES",
   heading: "Understanding Your Diagnosis",
    text:
      "A clear understanding of your diagnosis is an important first step. Your oncology team reviews the available medical information and identifies whether further investigations are needed.",
    image: diagnosisImage,
    alt: "Diagnostic imaging equipment in a clinical setting",
    points: [
      "Clinical assessment and specialist consultations",
      "Review of biopsy, pathology and imaging reports",
      "Additional investigations and biomarker testing where appropriate",
      "Guidance on understanding your diagnosis and next steps",
    ],
  },
  {
    code: "TREATMENT & CARE 02",
    label: "TREATMENT SERVICES",
    heading: "Personalised Treatment Planning",
    text:
      "Treatment decisions depend on the type and stage of cancer, the patient's overall health and individual clinical needs. The oncology team discusses suitable treatment approaches and helps patients understand their options.",
    image: treatmentImage,
    alt: "Patient speaking with a healthcare professional",
    points: [
      "Specialist consultations and treatment discussions",
      "Multidisciplinary team review where appropriate",
      "Guidance on surgery, chemotherapy and radiation therapy",
      "Information about targeted therapy and immunotherapy where suitable & Supportive care during treatment",
    ],
  },
  {
    code: "RECOVERY & ONGOING SUPPORT 03",
    label: "REHABILITATION SERVICES",
    heading: "Support for Recovery and Beyond",
    text:
      "Care continues beyond active treatment. Appropriate supportive services can help patients manage treatment-related challenges, regain strength and maintain quality of life.",
    image: recoveryImage,
    alt: "Caregiver supporting a patient during recovery",
    points: [
      "Nutrition and dietary guidance",
      "Emotional and psychological support",
      "Pain and symptom management & Physiotherapy and cancer rehabilitation",
      "Family and caregiver guidance & Follow-up and survivorship support",
    ],
  },
];


export default function HomePathway() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* BREAST CANCER CARE INTRODUCTION */}
      <section className="relative overflow-hidden bg-white">
        <div className="section-padding">
          <div className="page-container grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

            {/* LEFT SIDE CONTENT */}
            <motion.div
              initial={{
                opacity: 0,
                x: reduceMotion ? 0 : -24,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <SectionTitle
                center={false}
                eyebrow="KIMS RENOVA CANCER HOSPITAL"
                title="Every Cancer Is Different. Your Treatment Should Be Too."
                description="At KIMS RENOVA Cancer Hospital, we are committed to patient-centred cancer care through personalised treatment planning,
                clinical expertise and compassionate support. From accurate diagnosis and multidisciplinary planning to treatment, 
                recovery and follow-up, our specialists work together around the needs of each patient."
              />
              
              {/* <p className="max-w-2xl text-[16px] leading-7 text-ink"> */}
              <p className="mt-1 max-w-3xl text-[17px] leading-7 text-[#494848] sm:text-[18px]">
                Every patient's cancer journey is unique. At KIMS RENOVA, our
                multidisciplinary team focuses on understanding individual
                needs and guiding patients through every stage of care.
                From diagnosis and treatment to recovery and follow-up,
                we strive to provide compassionate support and help
                patients make informed decisions about their health.
              </p>

              {/* COMPASSIONATE CARE CARD */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: reduceMotion ? 0 : 15,
                }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-4 mb-5 rounded-2xl border border-[#dfe8de] bg-[#f7f9f6] p-5 sm:p-6"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e7eee7] text-[#304b3c]">
                    <Users size={25} />
                  </span>

                  <div>
                    <h3 className="text-lg font-bold text-[#191919]">
                      Compassionate care and guidance
                    </h3>

                    <p className="mt-1 text-[16px] leading-6 text-[#232323]">
                      Understand assessments, discuss care options and
                      prepare for conversations with your healthcare team.
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                  {[
                    "Clear information",
                    "Supportive care",
                    "Informed decisions",
                  ].map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#304b3c]"
                    >
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-[#3D8065]"
                      />
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* INTRODUCTION BUTTONS */}
              <div className="mt-5 flex flex-row flex-wrap gap-3">
                <Link
                  to="/appointments"
                  className="btn-primary inline-flex w-auto items-center justify-center gap-1.5 !px-3 !py-1.5 text-[14px] sm:!px-5 sm:!py-2 sm:text-base"
                >
                  Book an Appointment
                  <ArrowUpRight size={18} />
                </Link>

                <Link
                  to="/doctors"
                  className="btn-secondary inline-flex w-auto items-center justify-center !px-3 !py-1.5 text-[14px] sm:!px-5 sm:!py-2 sm:text-base"
                >
                  Meet Our Doctors  
                </Link>
                {/* <Link
                  to="/services/second-opinion"
                  className="btn-secondary inline-flex items-center justify-center !py-2"
                >
                 Get a Second Opinion 
                </Link> */}
              </div>
            </motion.div>

            {/* RIGHT SIDE IMAGE */}
            <motion.div
              initial={{
                opacity: 0,
                x: reduceMotion ? 0 : 24,
              }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl border border-[#dfe8de] bg-[#f7f9f6] shadow-md">
                <img
                  src={breastCare1}
                  alt="Healthcare professional providing medical care"
                  className="h-[360px] w-full object-cover transition-transform duration-700 hover:scale-[1.03] sm:h-[460px] lg:h-[520px]"
                  loading="lazy"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <WaveDivider from="#FFFFFF" to="#F6F9F6" />

      {/* BREAST CARE JOURNEY - THREE PROGRAMME PILLARS */}
      <section className="section-padding bg-mist">
        <div className="page-container">

          <motion.div
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 20,
            }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <SectionTitle
              eyebrow="YOUR CANCER CARE JOURNEY"
              title="One connected journey. Three focused pillars."
              description="Explore KIMS RENOVA's connected approach to breast cancer diagnosis, personalised treatment and rehabilitation."
            />
          </motion.div>

          {/* THREE PILLAR CARDS */}
          <div className="mt-6 grid gap-7 md:grid-cols-2 xl:grid-cols-3">

            {programmeStages.map((stage, index) => (
              <motion.article
                key={stage.code}
                initial={{
                  opacity: 0,
                  y: reduceMotion ? 0 : 24,
                }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: reduceMotion ? 0 : index * 0.12,
                }}
                whileHover={reduceMotion ? {} : { y: -6 }}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-premium transition-shadow duration-300 hover:shadow-xl"
              >

                {/* IMAGE WITH PILLAR NAME */}
                <div className="relative h-56 overflow-hidden sm:h-64">

                  <img
                    src={stage.image}
                    alt={stage.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#173b2b]/65 via-transparent to-transparent" />

                  {/* PILLAR NAME BADGE */}
                  <span className="absolute left-5 top-5 inline-flex items-center rounded-full border border-white/80 bg-white px-3 py-1 text-[12px] font-extrabold tracking-wider text-[#476b55] shadow-lg">
                    {stage.code}
                  </span>

                  {/* SERVICE LABEL */}
                  <span className="absolute bottom-5 left-5 rounded-full bg-[#e87744] px-3 py-1.5 text-xs font-bold tracking-wider text-white shadow-md">
                    {stage.label}
                  </span>

                </div>

                {/* CARD CONTENT */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">

                  <h3 className="display-font text-xl font-bold leading-snug text-heading sm:text-2xl">
                    {stage.heading}
                  </h3>

                  <p className="mt-3 text-[16px] leading-7 text-[#141414] sm:text-[18px]">
                    {stage.text}
                  </p>

                  {/* HIGHLIGHTS */}
                  <ul className="mt-5 flex-1 space-y-3">
                    {stage.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-[16px] leading-6 text-[#232323] sm:text-[18px]"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-1 shrink-0 text-sky"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* KNOW MORE BUTTON */}
                  <Link
                    to="/patient-care"
                    className="group/button mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-royal px-4 py-2 text-[18px] font-bold text-white transition-all duration-300 hover:bg-sky"
                  >
                    Know More About

                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-300 group-hover/button:translate-x-1 group-hover/button:-translate-y-1"
                    />
                  </Link>

                </div>
              </motion.article>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}



