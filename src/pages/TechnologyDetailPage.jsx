
import { Link, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
 
} from "lucide-react";

import appointmentsWave from "../assets/appointments-wave.jpg";


import {
  getTechnologyDetails,
  getTechnologies,
} from "../api/technologyApi";

import * as LucideIcons from "lucide-react";
import {
  getSpecialities,
  mediaUrl,
} from "../api/specialitiesApi";

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

function findRelatedSpeciality(name, specialitiesList = []) {
  const normalizedName = normalizeText(name);
  return specialitiesList.find((item) => {
    const title = normalizeText(item.name);
    const slug = normalizeText(item.slug);

    

    return (
      title === normalizedName ||
      slug === normalizedName ||
      title.includes(normalizedName) ||
      normalizedName.includes(title)
    );
  });
}
/* DYNAMIC SPECIALITY ICON */
function getSpecialityIcon(iconName) {
  if (!iconName || typeof iconName !== "string") {
    return LucideIcons.Stethoscope;
  }
  const formattedName = iconName
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
  return LucideIcons[formattedName] || LucideIcons.Stethoscope;
}

/* --------------------------------------------------
   NORMALIZE TECHNOLOGY API RESPONSE
-------------------------------------------------- */

function normalizeTechnologyDetails(responseData) {
  if (!responseData) return null;

  // Handle Axios response and nested backend response formats
  let data = responseData;

  if (data?.data) {
    data = data.data;
  }

  if (data?.data) {
    data = data.data;
  }

  const tech = data?.technology || data?.tech || data;

  if (!tech || (!tech.slug && !tech.title && !tech.name)) {
    console.error("Invalid technology response:", responseData);
    return null;
  }

  const technologyImage = tech.thumbnail || tech.image || "";

  const rawSpecialities =
    data.specialities ||
    tech.specialities ||
    [];

  const rawSections =
    data.sections ||
    tech.sections ||
    [];

  const rawFaqs =
    data.faqs ||
    tech.faqs ||
    [];

  return {
    ...data,
    ...tech,

    title: tech.title || tech.name || "",
    slug: tech.slug || "",
    category: tech.category || "",

    description:
      tech.short_description ||
      tech.description ||
      "",

    detailIntro:
      tech.detail_intro ||
      tech.detailIntro ||
      tech.description ||
      tech.short_description ||
      "",

    // IMPORTANT: use tech here, not item
    image: technologyImage
      ? mediaUrl(technologyImage)
      : "",

    imageAlt:
      tech.image_alt ||
      tech.title ||
      tech.name ||
      "",

    specialities: Array.isArray(rawSpecialities)
      ? rawSpecialities.map((item) =>
          typeof item === "string"
            ? item
            : item?.name || item?.title || ""
        ).filter(Boolean)
      : [],

    sections: Array.isArray(rawSections)
      ? rawSections.map((section) => ({
          id: section.id,

          title:
            section.heading ||
            section.title ||
            "",

          paragraphs: section.paragraph
            ? [section.paragraph]
            : Array.isArray(section.paragraphs)
              ? section.paragraphs
              : section.content
                ? [section.content]
                : [],

          image: section.image
            ? mediaUrl(section.image)
            : section.thumbnail
              ? mediaUrl(section.thumbnail)
              : "",

          imageAlt:
            section.image_alt ||
            section.heading ||
            section.title ||
            "",

          points: Array.isArray(section.points)
            ? section.points.map((point) =>
                typeof point === "string"
                  ? point
                  : point.point_text ||
                    point.text ||
                    ""
              ).filter(Boolean)
            : [],
        }))
      : [],

    faqs: Array.isArray(rawFaqs)
      ? rawFaqs.map((faq) => ({
          id: faq.id,
          question: faq.question || "",
          answer: faq.answer || "",
        }))
      : [],
  };
}
/* --------------------------------------------------
   BREADCRUMB
-------------------------------------------------- */

function Breadcrumb({ title }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
      style={{
        backgroundImage: `url(${appointmentsWave})`,
      }}
    >
      <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
        <ol className="flex flex-wrap items-center gap-2 text-[14px] sm:text-[15px]">
          <li>
            <Link
              to="/"
              className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
            >
              Home
            </Link>
          </li>

          <li aria-hidden="true" className="text-white/90 drop-shadow-md">
            /
          </li>

          <li>
            <Link
              to="/technology"
              className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
            >
              Our Technology
            </Link>
          </li>

          <li aria-hidden="true" className="text-white/90 drop-shadow-md">
            /
          </li>

          <li
            aria-current="page"
            className="font-bold text-white drop-shadow-md"
          >
            {title}
          </li>
        </ol>
      </div>
    </nav>
  );
}

/* --------------------------------------------------
   CENTERED SECTION HEADING
-------------------------------------------------- */

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
      {eyebrow && (
        <p className="text-[15px] font-extrabold uppercase tracking-[.18em] text-[#A34116] sm:text-[16px]">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-2xl font-bold leading-tight text-[#263C30] sm:text-3xl lg:text-[36px]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-[16px] leading-8 text-[#313131] sm:text-[18px]">
          {description}
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------------
   TECHNOLOGY DETAIL SECTION
-------------------------------------------------- */

function TechnologySection({ section, index }) {
  const imageOnRight = index % 2 === 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.45 }}
      className="py-8 sm:py-12"
    >
      {/* CENTERED HEADING */}

      <SectionHeading
        eyebrow={`${String(index + 1).padStart(2, "0")} / TECHNOLOGY DETAILS`}
        title={section.title}
      />

      {/* IMAGE + CONTENT */}

      <div className="grid items-stretch gap-7 lg:grid-cols-2 lg:gap-10">
        {/* CONTENT */}

        <div
          className={`flex min-w-0 flex-col justify-center ${
            imageOnRight ? "lg:order-2" : "lg:order-1"
          }`}
        >
          {section.paragraphs?.map((paragraph, paragraphIndex) => (
            <p
              key={paragraphIndex}
              className="mb-4 text-[16px] leading-8 text-[#141414] last:mb-0 sm:text-[18px]"
            >
              {paragraph}
            </p>
          ))}

          {section.points?.length > 0 && (
            <ul className="mt-5 space-y-4">
              {section.points.map((point, pointIndex) => (
                <li
                  key={pointIndex}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-1 shrink-0 text-[#A34116]"
                  />

                  <span className="text-[16px] leading-7 text-[#141414] sm:text-[18px]">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* IMAGE */}

        {section.image && (
          <div
            className={`min-w-0 ${
              imageOnRight ? "lg:order-1" : "lg:order-2"
            }`}
          >
            <img
              src={section.image}
              alt={section.imageAlt || section.title}
              loading="lazy"
              className="h-[280px] w-full rounded-[22px] object-cover sm:h-[350px] lg:h-full lg:min-h-[360px] lg:max-h-[460px]"
            />
          </div>
        )}
      </div>
    </motion.section>
  );
}

/* --------------------------------------------------
   RELATED SPECIALITIES
-------------------------------------------------- */
function RelatedSpecialities({
  names = [],
  specialitiesList = [],
}) {
  const relatedSpecialities = names
    .map((name) =>
      findRelatedSpeciality(name, specialitiesList)
    )
    .filter(Boolean);

  if (!relatedSpecialities.length) return null;
  return (
    <section className="py-14 md:py-16">
      <div className="page-container">
        <SectionHeading
          eyebrow="OUR EXPERTISE"
          title="Related Specialities"
          description="Explore the specialist teams involved in planning and delivering personalised cancer treatment and comprehensive patient care."
        />

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
          {relatedSpecialities.map((speciality) => {
            const Icon = getSpecialityIcon(speciality.icon_name);

            return (
              <Link
                key={speciality.slug}
                to={`/specialities/${speciality.slug}`}
                className="group flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-[#dce6dc] bg-white px-6 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#476b55] hover:shadow-md"
              >
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f6ef] text-[#476b55] transition-colors group-hover:bg-[#476b55] group-hover:text-white">
                  <Icon size={27} strokeWidth={1.7} />
                </span>

                <h3 className="text-base font-semibold leading-snug text-[#141414] md:text-lg">
                  {/* {speciality.title} */}
                  {speciality.name}
                </h3>

                <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#A34116]">
                  Explore Speciality
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------
   RELATED TECHNOLOGIES
-------------------------------------------------- */

function RelatedTechnologies({ technology, allItems = [] }) {
  if (!technology) return null;

  const relatedItems = allItems
    .filter((item) => item.slug !== technology.slug)
    .filter((item) => {
      const currentSpecialities = technology.specialities || [];
      const itemSpecialities = item.specialities || [];

      return currentSpecialities.some((speciality =>
        itemSpecialities.includes(speciality)
      ));
    })
    .slice(0, 3);

  // Fallback: show other technologies if no speciality matches
  const displayItems =
    relatedItems.length > 0
      ? relatedItems
      : allItems
          .filter((item) => item.slug !== technology.slug)
          .slice(0, 3);

  if (!displayItems.length) return null;

  return (
    <section className="py-12 sm:py-14">
      <SectionHeading
        eyebrow="EXPLORE MORE"
        title="Explore Related Technologies"
        description="Discover other advanced technologies that support diagnosis, treatment planning and personalised cancer care."
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item, index) => (
          <motion.article
            key={item.slug}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E3EAE0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* IMAGE */}
            <div className="relative h-[210px] overflow-hidden">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.imageAlt || item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#263C30]/50 via-transparent to-transparent" />

              {item.category && (
                <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#476B55]">
                  {item.category}
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="text-lg font-bold leading-snug text-[#263C30] sm:text-xl">
                {item.title}
              </h3>

              <p className="mt-3 flex-1 text-[15px] leading-7 text-[#141414] sm:text-[18px]">
                {item.description}
              </p>

              <Link
                to={`/technology/${item.slug}`}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#304B3C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#963D16]"
              >
                Know More
                <ArrowRight size={17} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------
   FAQ
-------------------------------------------------- */

function FrequentlyAskedQuestions({ faqs }) {
  if (!faqs?.length) return null;

  return (
    <section className="py-10 sm:py-14">
      <SectionHeading
        eyebrow="COMMON QUESTIONS"
        title="Frequently Asked Questions"
        description="Find answers to common questions about this technology."
      />

      <div className="mx-auto max-w-4xl divide-y divide-[#E5EBE2]">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group py-5"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-bold leading-7 text-[#304B3C] marker:hidden sm:text-[18px]">
              <span>{faq.question}</span>

              <ChevronRight
                size={19}
                className="mt-1 shrink-0 text-[#A34116] transition-transform group-open:rotate-90"
              />
            </summary>

            <p className="mt-4 pr-6 text-[16px] leading-8 text-[#141414] sm:text-[18px]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}


/* --------------------------------------------------
   CONTACT + APPOINTMENT CTA
-------------------------------------------------- */


function ContactActions() {
  return (
    <section className="mt-12 mb-12 w-full rounded-[24px] bg-[#304B3C] px-5 py-9 sm:mt-16 sm:mb-16 sm:px-10 sm:py-12 lg:px-14">
      <div className="flex w-full flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">
        <div className="max-w-2xl">
          <p className="text-[15px] font-extrabold uppercase tracking-[.17em] text-[#F2B477]">
            WE ARE HERE TO HELP
          </p>

          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
            Need More Information?
          </h2>

          <p className="mt-3 text-[16px] leading-7 text-[#E5EEE6] sm:text-[18px]">
            Contact our team for more information or to discuss an appointment with our care team.
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-row items-center justify-center gap-2 sm:w-auto sm:gap-3">
          <Link
            to="/contact"
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-white bg-transparent px-2 py-3 text-[12px] font-bold text-white transition hover:bg-white hover:text-[#304B3C] sm:flex-none sm:gap-2 sm:px-7 sm:py-3 sm:text-[15px]"
          >
            Contact Us
            <ArrowRight size={17} />
          </Link>

          <Link
            to="/appointments"
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-[#963D16] px-2 py-3 text-[12px] font-bold text-white transition hover:bg-[#D96535] sm:flex-none sm:gap-2 sm:px-7 sm:py-3 sm:text-[15px]"
          >
            Book an Appointment
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------
   MAIN TECHNOLOGY DETAIL PAGE
-------------------------------------------------- */

export default function TechnologyDetailPage() {
  const { slug } = useParams();

  const [technology, setTechnology] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [specialitiesList, setSpecialitiesList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH TECHNOLOGY DETAILS
  useEffect(() => {
    let active = true;

    const loadTechnology = async () => {
      try {
        setLoading(true);
        setError("");
        setTechnology(null);

        const response = await getTechnologyDetails(slug);
        console.log("TECHNOLOGY DETAIL API RESPONSE:", response);

        const normalized = normalizeTechnologyDetails(response);

        if (active) {
          setTechnology(normalized);
        }
      } catch (err) {
        console.error("Technology detail API error:", err);

        if (active) {
          setError("Unable to load technology details.");
          setTechnology(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      loadTechnology();
    }

    return () => {
      active = false;
    };
  }, [slug]);

  // FETCH ALL TECHNOLOGIES FOR RELATED TECHNOLOGIES
  useEffect(() => {
    let active = true;

    const loadTechnologies = async () => {
      try {
        const response = await getTechnologies();

        const rows =
          response?.data?.data ||
          response?.data?.rows ||
            response?.data ||
            [];

        if (active) {
          setAllItems(
            (Array.isArray(rows) ? rows : []).map((item) => ({
              ...item,
              title: item.title || item.name || "",
              slug: item.slug || "",
              category: item.category || "",
              description:
                item.short_description ||
                item.description ||
                "",
              image: item.thumbnail
                ? mediaUrl(item.thumbnail)
                : item.image
                  ? mediaUrl(item.image)
                  : "",
              imageAlt:
                item.image_alt ||
                item.title ||
                item.name ||
                "",
              specialities: Array.isArray(item.specialities)
                ? item.specialities.map((speciality) =>
                    typeof speciality === "string"
                      ? speciality
                      : speciality.name || ""
                  )
                : [],
            }))
          );
        }
      } catch (err) {
        console.error("Related technologies API error:", err);

        if (active) {
          setAllItems([]);
        }
      }
    };

    loadTechnologies();

    return () => {
      active = false;
    };
  }, []);

  // FETCH SPECIALITIES
  useEffect(() => {
    let active = true;

    const loadSpecialities = async () => {
      try {
       const rows = await getSpecialities({
  limit: 100,
  is_active: 1,
});

        if (active) {
          setSpecialitiesList(
            Array.isArray(rows) ? rows : []
          );
        }
      } catch (err) {
        console.error("Specialities API error:", err);

        if (active) {
          setSpecialitiesList([]);
        }
      }
    };

    loadSpecialities();

    return () => {
      active = false;
    };
  }, []);


    // LOADING STATE
  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#FFFDFA]">
        <p className="text-lg font-semibold text-[#304B3C]">
          Loading technology details...
        </p>
      </main>
    );
  }

  // ERROR / NOT FOUND
if (error || !technology) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[#FFFDFA] px-4 text-center">
      <h2 className="text-xl font-bold text-[#304B3C]">
        Unable to load technology details
      </h2>

      <p className="mt-3 text-sm text-red-600">
        {error || "Technology data not found."}
      </p>

      <Link
        to="/technology"
        className="mt-6 rounded-full bg-[#304B3C] px-6 py-3 font-semibold text-white"
      >
        Back to Technologies
      </Link>
    </main>
  );
}

  
  return (
    <main className="min-h-screen bg-[#FFFDFA] text-[#304B3C]">

      {/* BREADCRUMB */}
      <Breadcrumb title={technology.title} />

      {/* HERO */}

      <section className="bg-[#fdfefd]">
        <div className="page-container grid items-center gap-9 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-8 lg:py-20">

         <motion.div
  initial={{ opacity: 0, y: 22 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.55 }}
  className="text-center lg:text-left"
>
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-extrabold tracking-[.15em] text-[#476B55] shadow-sm sm:text-[12px]">
              {technology.category}
            </span>

           <h1 className="mt-5 text-center text-3xl font-bold leading-tight text-[#263C30] sm:text-4xl lg:text-left lg:text-5xl">
              {technology.title}
            </h1>

           {/* <p className="mx-auto mt-5 text-center text-[16px] leading-8 text-[#141414] sm:text-[18px] lg:mx-0 lg:text-left">
              {technology.description}
            </p> */}
            <p className="mx-auto mt-5 text-center text-[16px] leading-8 text-[#141414] sm:text-[18px] lg:mx-0 lg:text-left">
            {technology.detailIntro}
          </p>

            <Link
              to="/appointments"
             className="mx-auto mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#304B3C] px-4 py-2 text-[16px] font-bold text-white transition hover:bg-[#963D16] sm:text-[18px] lg:mx-0"
            >
              Book an Appointment
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          {technology.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={technology.image}
                alt={technology.imageAlt || technology.title}
                className="h-[270px] w-full rounded-[26px] object-cover shadow-xl sm:h-[360px] lg:h-[430px]"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* FIRST CONTENT SECTION - OVERVIEW PARAGRAPH */}

      <div className="page-container px-2 py-4 sm:px-6 sm:py-2 lg:px-4 lg:py-2">
        {/* <section className="mx-auto max-w-5xl py-4 text-center sm:py-7">
          <h2 className="text-2xl font-bold leading-tight text-[#263C30] sm:text-3xl lg:text-[36px]">
            Understanding {technology.title}
          </h2>

          <p className="mt-5 text-left text-[15px] leading-8 text-[#536357] sm:text-center sm:text-[17px]">
            {technology.detailIntro}
          </p>
        </section> */}

        {/* TECHNOLOGY DATA SECTIONS */}

        {technology.sections?.length > 0 && (
          <div className="mt-7 sm:mt-10">
            {technology.sections.map((section, index) => (
              <TechnologySection
                key={`${section.title}-${index}`}
                section={section}
                index={index}
              />
            ))}
          </div>
        )}

        {/* RELATED SPECIALITIES */}
        <RelatedSpecialities
          names={technology.specialities}
          specialitiesList={specialitiesList}
        />

        

        {/* FAQ */}
        <FrequentlyAskedQuestions faqs={technology.faqs} />

        {/* RELATED TECHNOLOGIES */}
<RelatedTechnologies
  technology={technology}
  allItems={allItems}
/>

      {/* <ContactActions /> */}
        <ContactActions />
      

      </div>
    </main>
  );
}


























// import { Link, Navigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   CheckCircle2,
//   ChevronRight,
//   ExternalLink,
//   Stethoscope,
// } from "lucide-react";

// import appointmentsWave from "../assets/appointments-wave.jpg";

// import { allTechnologyItems } from "../data/technologyData";

// import * as LucideIcons from "lucide-react";
// import { getSpecialities } from "../api/specialitiesApi";

// /* --------------------------------------------------
//    HELPERS
// -------------------------------------------------- */

// function normalizeText(value = "") {
//   return value
//     .toLowerCase()
//     .replace(/&/g, "and")
//     .replace(/[^a-z0-9]/g, "");
// }

// function findRelatedSpeciality(name, specialitiesList = []) {
//   const normalizedName = normalizeText(name);
//   return specialitiesList.find((item) => {
//     const title = normalizeText(item.name);
//     const slug = normalizeText(item.slug);

//     return (
//       title === normalizedName ||
//       slug === normalizedName ||
//       title.includes(normalizedName) ||
//       normalizedName.includes(title)
//     );
//   });
// }
// /* DYNAMIC SPECIALITY ICON */
// function getSpecialityIcon(iconName) {
//   if (!iconName || typeof iconName !== "string") {
//     return LucideIcons.Stethoscope;
//   }
//   const formattedName = iconName
//     .trim()
//     .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
//     .split(/[-_\s]+/)
//     .filter(Boolean)
//     .map(
//       (word) =>
//         word.charAt(0).toUpperCase() + word.slice(1)
//     )
//     .join("");
//   return LucideIcons[formattedName] || LucideIcons.Stethoscope;
// }

// /* --------------------------------------------------
//    BREADCRUMB
// -------------------------------------------------- */

// function Breadcrumb({ title }) {
//   return (
//     <nav
//       aria-label="Breadcrumb"
//       className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
//       style={{
//         backgroundImage: `url(${appointmentsWave})`,
//       }}
//     >
//       <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
//         <ol className="flex flex-wrap items-center gap-2 text-[14px] sm:text-[15px]">
//           <li>
//             <Link
//               to="/"
//               className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
//             >
//               Home
//             </Link>
//           </li>

//           <li aria-hidden="true" className="text-white/90 drop-shadow-md">
//             /
//           </li>

//           <li>
//             <Link
//               to="/technology"
//               className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
//             >
//               Our Technology
//             </Link>
//           </li>

//           <li aria-hidden="true" className="text-white/90 drop-shadow-md">
//             /
//           </li>

//           <li
//             aria-current="page"
//             className="font-bold text-white drop-shadow-md"
//           >
//             {title}
//           </li>
//         </ol>
//       </div>
//     </nav>
//   );
// }

// /* --------------------------------------------------
//    CENTERED SECTION HEADING
// -------------------------------------------------- */

// function SectionHeading({ eyebrow, title, description }) {
//   return (
//     <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
//       {eyebrow && (
//         <p className="text-[15px] font-extrabold uppercase tracking-[.18em] text-[#A34116] sm:text-[16px]">
//           {eyebrow}
//         </p>
//       )}

//       <h2 className="mt-3 text-2xl font-bold leading-tight text-[#263C30] sm:text-3xl lg:text-[36px]">
//         {title}
//       </h2>

//       {description && (
//         <p className="mt-4 text-[16px] leading-8 text-[#313131] sm:text-[18px]">
//           {description}
//         </p>
//       )}
//     </div>
//   );
// }

// /* --------------------------------------------------
//    TECHNOLOGY DETAIL SECTION
// -------------------------------------------------- */

// function TechnologySection({ section, index }) {
//   const imageOnRight = index % 2 === 1;

//   return (
//     <motion.section
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.12 }}
//       transition={{ duration: 0.45 }}
//       className="py-8 sm:py-12"
//     >
//       {/* CENTERED HEADING */}

//       <SectionHeading
//         eyebrow={`${String(index + 1).padStart(2, "0")} / TECHNOLOGY DETAILS`}
//         title={section.title}
//       />

//       {/* IMAGE + CONTENT */}

//       <div className="grid items-stretch gap-7 lg:grid-cols-2 lg:gap-10">
//         {/* CONTENT */}

//         <div
//           className={`flex min-w-0 flex-col justify-center ${
//             imageOnRight ? "lg:order-2" : "lg:order-1"
//           }`}
//         >
//           {section.paragraphs?.map((paragraph, paragraphIndex) => (
//             <p
//               key={paragraphIndex}
//               className="mb-4 text-[16px] leading-8 text-[#141414] last:mb-0 sm:text-[18px]"
//             >
//               {paragraph}
//             </p>
//           ))}

//           {section.points?.length > 0 && (
//             <ul className="mt-5 space-y-4">
//               {section.points.map((point, pointIndex) => (
//                 <li
//                   key={pointIndex}
//                   className="flex items-start gap-3"
//                 >
//                   <CheckCircle2
//                     size={20}
//                     className="mt-1 shrink-0 text-[#A34116]"
//                   />

//                   <span className="text-[16px] leading-7 text-[#141414] sm:text-[18px]">
//                     {point}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* IMAGE */}

//         {section.image && (
//           <div
//             className={`min-w-0 ${
//               imageOnRight ? "lg:order-1" : "lg:order-2"
//             }`}
//           >
//             <img
//               src={section.image}
//               alt={section.imageAlt || section.title}
//               loading="lazy"
//               className="h-[280px] w-full rounded-[22px] object-cover sm:h-[350px] lg:h-full lg:min-h-[360px] lg:max-h-[460px]"
//             />
//           </div>
//         )}
//       </div>
//     </motion.section>
//   );
// }

// /* --------------------------------------------------
//    RELATED SPECIALITIES
// -------------------------------------------------- */
// function RelatedSpecialities({
//   names = [],
//   specialitiesList = [],
// }) {
//   const relatedSpecialities = names
//     .map((name) =>
//       findRelatedSpeciality(name, specialitiesList)
//     )
//     .filter(Boolean);

//   if (!relatedSpecialities.length) return null;
//   return (
//     <section className="py-14 md:py-16">
//       <div className="page-container">
//         <SectionHeading
//           eyebrow="OUR EXPERTISE"
//           title="Related Specialities"
//           description="Explore the specialist teams involved in planning and delivering personalised cancer treatment and comprehensive patient care."
//         />

//         <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
//           {relatedSpecialities.map((speciality) => {
//             const Icon = getSpecialityIcon(speciality.icon_name);

//             return (
//               <Link
//                 key={speciality.slug}
//                 to={`/specialities/${speciality.slug}`}
//                 className="group flex min-h-[150px] flex-col items-center justify-center rounded-2xl border border-[#dce6dc] bg-white px-6 py-7 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#476b55] hover:shadow-md"
//               >
//                 <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f1f6ef] text-[#476b55] transition-colors group-hover:bg-[#476b55] group-hover:text-white">
//                   <Icon size={27} strokeWidth={1.7} />
//                 </span>

//                 <h3 className="text-base font-semibold leading-snug text-[#141414] md:text-lg">
//                   {/* {speciality.title} */}
//                   {speciality.name}
//                 </h3>

//                 <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#A34116]">
//                   Explore Speciality
//                   <ArrowRight
//                     size={15}
//                     className="transition-transform group-hover:translate-x-1"
//                   />
//                 </span>
//               </Link>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// /* --------------------------------------------------
//    RELATED TECHNOLOGIES
// -------------------------------------------------- */

// function RelatedTechnologies({ technology, allItems = [] }) {
//   if (!technology) return null;

//   const relatedItems = allItems
//     .filter((item) => item.slug !== technology.slug)
//     .filter((item) => {
//       const currentSpecialities = technology.specialities || [];
//       const itemSpecialities = item.specialities || [];

//       return currentSpecialities.some((speciality =>
//         itemSpecialities.includes(speciality)
//       ));
//     })
//     .slice(0, 3);

//   // Fallback: show other technologies if no speciality matches
//   const displayItems =
//     relatedItems.length > 0
//       ? relatedItems
//       : allItems
//           .filter((item) => item.slug !== technology.slug)
//           .slice(0, 3);

//   if (!displayItems.length) return null;

//   return (
//     <section className="py-12 sm:py-14">
//       <SectionHeading
//         eyebrow="EXPLORE MORE"
//         title="Explore Related Technologies"
//         description="Discover other advanced technologies that support diagnosis, treatment planning and personalised cancer care."
//       />

//       <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {displayItems.map((item, index) => (
//           <motion.article
//             key={item.slug}
//             initial={{ opacity: 0, y: 18 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.12 }}
//             transition={{ duration: 0.4, delay: index * 0.08 }}
//             className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E3EAE0] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
//           >
//             {/* IMAGE */}
//             <div className="relative h-[210px] overflow-hidden">
//               {item.image && (
//                 <img
//                   src={item.image}
//                   alt={item.imageAlt || item.title}
//                   loading="lazy"
//                   className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
//                 />
//               )}

//               <div className="absolute inset-0 bg-gradient-to-t from-[#263C30]/50 via-transparent to-transparent" />

//               {item.category && (
//                 <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#476B55]">
//                   {item.category}
//                 </span>
//               )}
//             </div>

//             {/* CONTENT */}
//             <div className="flex flex-1 flex-col p-5 sm:p-6">
//               <h3 className="text-lg font-bold leading-snug text-[#263C30] sm:text-xl">
//                 {item.title}
//               </h3>

//               <p className="mt-3 flex-1 text-[15px] leading-7 text-[#141414] sm:text-[18px]">
//                 {item.description}
//               </p>

//               <Link
//                 to={`/technology/${item.slug}`}
//                 className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-full bg-[#304B3C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#963D16]"
//               >
//                 Know More
//                 <ArrowRight size={17} />
//               </Link>
//             </div>
//           </motion.article>
//         ))}
//       </div>
//     </section>
//   );
// }

// /* --------------------------------------------------
//    FAQ
// -------------------------------------------------- */

// function FrequentlyAskedQuestions({ faqs }) {
//   if (!faqs?.length) return null;

//   return (
//     <section className="py-10 sm:py-14">
//       <SectionHeading
//         eyebrow="COMMON QUESTIONS"
//         title="Frequently Asked Questions"
//         description="Find answers to common questions about this technology."
//       />

//       <div className="mx-auto max-w-4xl divide-y divide-[#E5EBE2]">
//         {faqs.map((faq, index) => (
//           <details
//             key={index}
//             className="group py-5"
//           >
//             <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-bold leading-7 text-[#304B3C] marker:hidden sm:text-[18px]">
//               <span>{faq.question}</span>

//               <ChevronRight
//                 size={19}
//                 className="mt-1 shrink-0 text-[#A34116] transition-transform group-open:rotate-90"
//               />
//             </summary>

//             <p className="mt-4 pr-6 text-[16px] leading-8 text-[#141414] sm:text-[18px]">
//               {faq.answer}
//             </p>
//           </details>
//         ))}
//       </div>
//     </section>
//   );
// }


// /* --------------------------------------------------
//    CONTACT + APPOINTMENT CTA
// -------------------------------------------------- */


// function ContactActions() {
//   return (
//     <section className="mt-12 mb-12 w-full rounded-[24px] bg-[#304B3C] px-5 py-9 sm:mt-16 sm:mb-16 sm:px-10 sm:py-12 lg:px-14">
//       <div className="flex w-full flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">
//         <div className="max-w-2xl">
//           <p className="text-[15px] font-extrabold uppercase tracking-[.17em] text-[#F2B477]">
//             WE ARE HERE TO HELP
//           </p>

//           <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
//             Need More Information?
//           </h2>

//           <p className="mt-3 text-[16px] leading-7 text-[#E5EEE6] sm:text-[18px]">
//             Contact our team for more information or to discuss an appointment with our care team.
//           </p>
//         </div>

//         <div className="flex w-full shrink-0 flex-row items-center justify-center gap-2 sm:w-auto sm:gap-3">
//           <Link
//             to="/contact"
//             className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-white bg-transparent px-2 py-3 text-[12px] font-bold text-white transition hover:bg-white hover:text-[#304B3C] sm:flex-none sm:gap-2 sm:px-7 sm:py-3 sm:text-[15px]"
//           >
//             Contact Us
//             <ArrowRight size={17} />
//           </Link>

//           <Link
//             to="/appointments"
//             className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-[#963D16] px-2 py-3 text-[12px] font-bold text-white transition hover:bg-[#D96535] sm:flex-none sm:gap-2 sm:px-7 sm:py-3 sm:text-[15px]"
//           >
//             Book an Appointment
//             <ArrowRight size={17} />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }


// /* --------------------------------------------------
//    MAIN TECHNOLOGY DETAIL PAGE
// -------------------------------------------------- */
// export default function TechnologyDetailPage() {
//   const { slug } = useParams();

//   // BACKEND SPECIALITIES
//   const [specialitiesList, setSpecialitiesList] = useState([]);

//   useEffect(() => {
//     let active = true;

//     const fetchSpecialities = async () => {
//       try {
//         const data = await getSpecialities({
//           limit: 100,
//           is_active: 1,
//         });

//         const rows = Array.isArray(data)
//           ? data
//           : Array.isArray(data?.rows)
//             ? data.rows
//             : [];

//         const activeSpecialities = rows.filter(
//           (item) =>
//             item.slug &&
//             item.name &&
//             (
//               item.is_active === 1 ||
//               item.is_active === true ||
//               item.is_active === "1"
//             )
//         );

//         if (active) {
//           setSpecialitiesList(activeSpecialities);
//         }
//       } catch (error) {
//         console.error(
//           "Technology detail specialities API error:",
//           error
//         );

//         if (active) {
//           setSpecialitiesList([]);
//         }
//       }
//     };

//     fetchSpecialities();

//     return () => {
//       active = false;
//     };
//   }, []);

//   const technology = allTechnologyItems.find(
//     (item) => item.slug === slug
//   );

//   if (!technology) {
//     return <Navigate to="/technology" replace />;
//   }

//   return (
//     <main className="min-h-screen bg-[#FFFDFA] text-[#304B3C]">

//       {/* BREADCRUMB */}
//       <Breadcrumb title={technology.title} />

//       {/* HERO */}

//       <section className="bg-[#fdfefd]">
//         <div className="page-container grid items-center gap-9 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-14 lg:px-8 lg:py-20">

//          <motion.div
//   initial={{ opacity: 0, y: 22 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.55 }}
//   className="text-center lg:text-left"
// >
//             <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-extrabold tracking-[.15em] text-[#476B55] shadow-sm sm:text-[12px]">
//               {technology.category}
//             </span>

//            <h1 className="mt-5 text-center text-3xl font-bold leading-tight text-[#263C30] sm:text-4xl lg:text-left lg:text-5xl">
//               {technology.title}
//             </h1>

//            <p className="mx-auto mt-5 text-center text-[16px] leading-8 text-[#141414] sm:text-[18px] lg:mx-0 lg:text-left">
//               {technology.description}
//             </p>
//             <p className="mx-auto mt-5 text-center text-[16px] leading-8 text-[#141414] sm:text-[18px] lg:mx-0 lg:text-left">
//             {technology.detailIntro}
//           </p>

//             <Link
//               to="/appointments"
//              className="mx-auto mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#304B3C] px-4 py-2 text-[16px] font-bold text-white transition hover:bg-[#963D16] sm:text-[18px] lg:mx-0"
//             >
//               Book an Appointment
//               <ArrowRight size={18} />
//             </Link>
//           </motion.div>

//           {technology.image && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.97 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.6 }}
//             >
//               <img
//                 src={technology.image}
//                 alt={technology.imageAlt || technology.title}
//                 className="h-[270px] w-full rounded-[26px] object-cover shadow-xl sm:h-[360px] lg:h-[430px]"
//               />
//             </motion.div>
//           )}
//         </div>
//       </section>

//       {/* FIRST CONTENT SECTION - OVERVIEW PARAGRAPH */}

//       <div className="page-container px-2 py-4 sm:px-6 sm:py-2 lg:px-4 lg:py-2">
//         {/* <section className="mx-auto max-w-5xl py-4 text-center sm:py-7">
//           <h2 className="text-2xl font-bold leading-tight text-[#263C30] sm:text-3xl lg:text-[36px]">
//             Understanding {technology.title}
//           </h2>

//           <p className="mt-5 text-left text-[15px] leading-8 text-[#536357] sm:text-center sm:text-[17px]">
//             {technology.detailIntro}
//           </p>
//         </section> */}

//         {/* TECHNOLOGY DATA SECTIONS */}

//         {technology.sections?.length > 0 && (
//           <div className="mt-7 sm:mt-10">
//             {technology.sections.map((section, index) => (
//               <TechnologySection
//                 key={`${section.title}-${index}`}
//                 section={section}
//                 index={index}
//               />
//             ))}
//           </div>
//         )}

//         {/* RELATED SPECIALITIES */}
//         <RelatedSpecialities
//           names={technology.specialities}
//           specialitiesList={specialitiesList}
//         />

        

//         {/* FAQ */}
//         <FrequentlyAskedQuestions faqs={technology.faqs} />

//         {/* RELATED TECHNOLOGIES */}
// <RelatedTechnologies
//   technology={technology}
//   allItems={allTechnologyItems}
// />

//       {/* <ContactActions /> */}
//         <ContactActions />
      

//       </div>
//     </main>
//   );
// }




