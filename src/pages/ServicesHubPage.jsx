
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useServicesWithContent, mediaUrl, slugify } from "../api/services";
import {
  ArrowRight,
  HeartPulse,
  ScanLine,
  Stethoscope,
  Cpu,
  MessageCircleHeart,
  ShieldCheck,
  ChevronRight,
  Home,
} from "lucide-react";

import { cancerTypes } from "../data/cancerTypeContent";
import { screeningDiagnosticServices } from "../data/screeningDiagnosticsData";
import { treatmentServices } from "../data/treatmentServicesData";
import { technologyItems } from "../data/technologyData";

import appointmentsWave from "../assets/appointments-wave.jpg";
/* --------------------------------------------------
   SERVICE CARD
-------------------------------------------------- */


function ServiceCard({
  item,
  link,
  index = 0,
  fallbackIcon: Icon = HeartPulse,
  horizontal = false,
  transparentHorizontal = false,
  transparentVertical = false,
   imageRight = false
}) {
  const description =
    item.cardDescription ||
    item.description ||
    item.intro ||
    "Explore our specialised cancer care services and treatment options.";

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay: (index % 2) * 0.06,
      }}
  
      className={`group flex h-full overflow-hidden transition-all duration-300 ${
  horizontal
    ? imageRight
      ? "flex-row-reverse rounded-2xl"
      : transparentHorizontal
        ? "flex-row rounded-2xl"
        : "flex-row rounded-2xl border border-[#e5ebe5] bg-white shadow-[0_4px_18px_rgba(38,60,48,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(38,60,48,0.12)]"
    : transparentVertical
      ? "flex-col rounded-2xl"
      : "flex-col rounded-2xl border border-[#e5ebe5] bg-white shadow-[0_4px_18px_rgba(38,60,48,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(38,60,48,0.12)]"
}`}
     
    >
  
      {/* IMAGE - RIGHT SIDE */}
<Link
  to={link}
  className={`relative block shrink-0 overflow-hidden bg-[#edf3ed] ${
    horizontal
      ? "w-[150px] h-[150px] shrink-0 sm:w-[190px] sm:h-[170px] lg:w-[220px] lg:h-[180px] xl:w-[250px] xl:h-[190px]"
      : "h-[205px] w-full"
  }`}
>
      {/* <Link
        to={link}
        className={`relative block shrink-0 overflow-hidden bg-[#edf3ed] ${
          horizontal
  ? "w-[150px] h-[150px] shrink-0 sm:w-[190px] sm:h-[170px] lg:w-[220px] lg:h-[180px] xl:w-[250px] xl:h-[190px]"
  : "h-[205px] w-full"
        }`}
      > */}
        {item.image ? (
          <img
            src={item.image}
            alt={item.imageAlt || item.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8f0e8] to-[#dce9df]">
            <Icon
              size={horizontal ? 38 : 58}
              strokeWidth={1.35}
              className="text-[#476b55]"
            />
          </div>
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#1e382c]/20 to-transparent"
        />

               {item.category && (
          <span
            className={`absolute rounded-full bg-white font-bold uppercase tracking-wider text-[#476b55] ${
              horizontal
                ? "bottom-2 left-2 px-2 py-1 text-[9px] sm:bottom-3 sm:left-3 sm:px-2.5 sm:text-[10px]"
                : "bottom-4 left-4 px-3 py-1.5 text-xs"
            }`}
          >
            {item.category}
          </span>
        )}
      </Link>

      {/* CONTENT */}
      {/* CONTENT - LEFT SIDE */}
<div
  className={`flex min-w-0 flex-1 flex-col ${
    horizontal
      ? "justify-center p-3 sm:p-5 lg:p-6"
      : "p-5 sm:p-6"
  }`}
>
        <h3
          className={`font-bold leading-snug text-[#263c30] transition-colors group-hover:text-[#A34116] ${
            horizontal
              ? "text-[15px] sm:text-lg lg:text-xl"
              : "text-[19px] sm:text-xl"
          }`}
        >
          {item.title}
        </h3>

       <p
        className={`mt-2 flex-1 text-[#141414] ${
          horizontal
            ? "text-[13px] leading-5 sm:mt-3 sm:text-[15px] sm:leading-6 lg:text-[16px]"
            : "mt-3 text-[16px] leading-7 sm:text-[18px]"
        }`}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 3,
          overflow: "hidden",
        }}
      >
        {description}
      </p>

        {/* KNOW MORE */}
        <Link
          to={link}
          className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#304b3c] font-semibold text-white transition-all duration-300 hover:bg-[#963D16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963D16] ${
            horizontal
              ? "px-3 py-2 text-xs sm:mt-5 sm:px-4 sm:py-2.5 sm:text-sm"
              : "mt-5 px-5 py-2.5 text-sm"
          }`}
        >
          Know More
          <ArrowRight
            size={horizontal ? 14 : 16}
            className="transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.article>
  );
}


/* --------------------------------------------------
   SECTION HEADING
-------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#476b55]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#476b55]">
        {Icon && <Icon size={15} />}
        {eyebrow}
      </div>

      <h2 className="text-2xl font-bold leading-tight text-[#263c30] sm:text-3xl lg:text-[36px]">
        {title}
      </h2>

      {/* {description && (
        <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-[#333434] sm:text-[18px]">
          {description}
        </p>
      )} */}

      <div className="mx-auto mt-2 h-1 w-20 rounded-full bg-[#963D16]" />
    </div>
  );
}

/* --------------------------------------------------
   SECTION VIEW ALL BUTTON
-------------------------------------------------- */

function SectionKnowMore({ to, label = "Know More" }) {
  return (
    <div className="mt-9 flex justify-center">
      <Link
        to={to}
        className="inline-flex items-center gap-2 rounded-full bg-[#304b3c] px-7 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:bg-[#963D16] hover:shadow-md"
      >
        {label}
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}

/* --------------------------------------------------
   SERVICE SECTION
-------------------------------------------------- */

function ServiceSection({
  id,
  eyebrow,
  title,
  description,
  items,
  icon: Icon,
  renderLink,
  fallbackIcon,
  background = "white",
  columns = "lg:grid-cols-3",
  limit,
  sectionLink,
  sectionButtonLabel = "Know More",
  horizontal = false,
  transparentHorizontal = false,
  transparentVertical = false,
  imageRight = false,
}) {
  const visibleItems = limit ? items.slice(0, limit) : items;

  return (
    <section
      id={id}
      className={`scroll-mt-28 py-14 sm:py-16 lg:py-[76px] ${
        background === "mist" ? "bg-[#f4f7f2]" : "bg-white"
      }`}
    >
      <div className="page-container px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          icon={Icon}
        />

        <div
  className={`grid grid-cols-1 gap-5 sm:gap-6 ${
    horizontal
      ? "md:grid-cols-2"
      : `sm:grid-cols-2 ${columns}`
  }`}
>
          {visibleItems.map((item, index) => (
            <ServiceCard
              key={item.slug || item.title}
              item={item}
              index={index}
              link={renderLink(item)}
              fallbackIcon={fallbackIcon}
              horizontal={horizontal}
              transparentHorizontal={transparentHorizontal}
              transparentVertical={transparentVertical}
              imageRight={imageRight}
            />
          ))}
        </div>

        {sectionLink && (
          <SectionKnowMore
            to={sectionLink}
            label={sectionButtonLabel}
          />
        )}
      </div>
    </section>
  );
}

/* --------------------------------------------------
   MAIN SERVICES PAGE
-------------------------------------------------- */
const SECTION_ICONS = [HeartPulse, ScanLine, Stethoscope, Cpu, ShieldCheck];

export default function ServicesHubPage() {
  const { services, loading } = useServicesWithContent();
  const { hash } = useLocation();

  // scroll to #section after the data has loaded
  useEffect(() => {
    if (!loading && hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading, hash]);

  return (
    <main className="overflow-hidden bg-white">
      {/* BREADCRUMB (unchanged) */}
      <nav
        aria-label="Breadcrumb"
        className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
        style={{ backgroundImage: `url(${appointmentsWave})` }}
      >
        <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
          <ol className="flex flex-wrap items-center gap-2 text-[15px] sm:text-[16px]">
            <li>
              <Link to="/" className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/90 drop-shadow-md">/</li>
            <li aria-current="page" className="font-bold text-white drop-shadow-md">Services</li>
          </ol>
        </div>
      </nav>

      {loading && (
        <div className="py-24 text-center text-[#476b55]">Loading services…</div>
      )}

      {/* ONE SECTION PER SERVICE ADDED IN THE ADMIN PANEL */}
      {services.map((service, i) => {
        const types = service.extra?.service_types || [];
        const Icon = SECTION_ICONS[i % SECTION_ICONS.length];

        const items = types.map((t) => ({
          slug: slugify(t.heading),
          title: t.heading,
          description: t.description,
          image: mediaUrl(t.image),
        }));

        // a service with no types yet: show a simple intro block with a button
        if (!items.length) {
          return (
            <section
              key={service.id}
              id={service.slug}
              className={`scroll-mt-28 py-14 sm:py-16 ${i % 2 === 0 ? "bg-[#f4f7f2]" : "bg-white"}`}
            >
              <div className="page-container px-4 sm:px-6 lg:px-8">
                <SectionHeading
                  eyebrow="Our Services"
                  title={service.name}
                  description={service.description}
                  icon={Icon}
                />
                <SectionKnowMore to={`/services/${service.slug}`} />
              </div>
            </section>
          );
        }

        return (
          <ServiceSection
            key={service.id}
            id={service.slug}
            eyebrow="Our Services"
            title={service.name}
            description={service.description}
            items={items}
            icon={Icon}
            fallbackIcon={Icon}
            renderLink={(item) => `/services/${service.slug}/${item.slug}`}
            // renderLink={() => `/services/${service.slug}`}
            background={i % 2 === 0 ? "mist" : "white"}
            columns="lg:grid-cols-3"
            limit={3}
            sectionLink={items.length > 3 ? `/services/${service.slug}` : undefined}
            sectionButtonLabel="View All"
          />
        );
      })}

      {/* FINAL APPOINTMENT CTA (unchanged) */}
      <section className="bg-[#263c30] py-12 sm:py-14">
        <div className="page-container flex flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Need Help Choosing the Right Care?</h2>
            <p className="mt-3 max-w-4xl text-[16px] leading-7 text-white/80 sm:text-[18px]">
              Connect with our team to learn more about our services and find the right next step for your care.
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
    </main>
  );
}










// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   HeartPulse,
//   ScanLine,
//   Stethoscope,
//   Cpu,
//   MessageCircleHeart,
//   ShieldCheck,
//   ChevronRight,
//   Home,
// } from "lucide-react";

// import { cancerTypes } from "../data/cancerTypeContent";
// import { screeningDiagnosticServices } from "../data/screeningDiagnosticsData";
// import { treatmentServices } from "../data/treatmentServicesData";
// import { technologyItems } from "../data/technologyData";

// import appointmentsWave from "../assets/appointments-wave.jpg";
// /* --------------------------------------------------
//    SERVICE CARD
// -------------------------------------------------- */


// function ServiceCard({
//   item,
//   link,
//   index = 0,
//   fallbackIcon: Icon = HeartPulse,
//   horizontal = false,
//   transparentHorizontal = false,
//   transparentVertical = false,
//    imageRight = false
// }) {
//   const description =
//     item.cardDescription ||
//     item.description ||
//     item.intro ||
//     "Explore our specialised cancer care services and treatment options.";

//   return (
//     <motion.article
//       initial={{ opacity: 0, y: 22 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.12 }}
//       transition={{
//         duration: 0.45,
//         delay: (index % 2) * 0.06,
//       }}
  
//       className={`group flex h-full overflow-hidden transition-all duration-300 ${
//   horizontal
//     ? imageRight
//       ? "flex-row-reverse rounded-2xl"
//       : transparentHorizontal
//         ? "flex-row rounded-2xl"
//         : "flex-row rounded-2xl border border-[#e5ebe5] bg-white shadow-[0_4px_18px_rgba(38,60,48,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(38,60,48,0.12)]"
//     : transparentVertical
//       ? "flex-col rounded-2xl"
//       : "flex-col rounded-2xl border border-[#e5ebe5] bg-white shadow-[0_4px_18px_rgba(38,60,48,0.06)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(38,60,48,0.12)]"
// }`}
     
//     >
  
//       {/* IMAGE - RIGHT SIDE */}
// <Link
//   to={link}
//   className={`relative block shrink-0 overflow-hidden bg-[#edf3ed] ${
//     horizontal
//       ? "w-[150px] h-[150px] shrink-0 sm:w-[190px] sm:h-[170px] lg:w-[220px] lg:h-[180px] xl:w-[250px] xl:h-[190px]"
//       : "h-[205px] w-full"
//   }`}
// >
//       {/* <Link
//         to={link}
//         className={`relative block shrink-0 overflow-hidden bg-[#edf3ed] ${
//           horizontal
//   ? "w-[150px] h-[150px] shrink-0 sm:w-[190px] sm:h-[170px] lg:w-[220px] lg:h-[180px] xl:w-[250px] xl:h-[190px]"
//   : "h-[205px] w-full"
//         }`}
//       > */}
//         {item.image ? (
//           <img
//             src={item.image}
//             alt={item.imageAlt || item.title}
//             loading="lazy"
//             className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
//           />
//         ) : (
//           <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#e8f0e8] to-[#dce9df]">
//             <Icon
//               size={horizontal ? 38 : 58}
//               strokeWidth={1.35}
//               className="text-[#476b55]"
//             />
//           </div>
//         )}

//         <div
//           aria-hidden="true"
//           className="absolute inset-0 bg-gradient-to-t from-[#1e382c]/20 to-transparent"
//         />

//                {item.category && (
//           <span
//             className={`absolute rounded-full bg-white font-bold uppercase tracking-wider text-[#476b55] ${
//               horizontal
//                 ? "bottom-2 left-2 px-2 py-1 text-[9px] sm:bottom-3 sm:left-3 sm:px-2.5 sm:text-[10px]"
//                 : "bottom-4 left-4 px-3 py-1.5 text-xs"
//             }`}
//           >
//             {item.category}
//           </span>
//         )}
//       </Link>

//       {/* CONTENT */}
//       {/* CONTENT - LEFT SIDE */}
// <div
//   className={`flex min-w-0 flex-1 flex-col ${
//     horizontal
//       ? "justify-center p-3 sm:p-5 lg:p-6"
//       : "p-5 sm:p-6"
//   }`}
// >
//         <h3
//           className={`font-bold leading-snug text-[#263c30] transition-colors group-hover:text-[#A34116] ${
//             horizontal
//               ? "text-[15px] sm:text-lg lg:text-xl"
//               : "text-[19px] sm:text-xl"
//           }`}
//         >
//           {item.title}
//         </h3>

//         <p
//           className={`mt-2 flex-1 text-[#141414] ${
//             horizontal
//               ? "text-[13px] leading-5 sm:mt-3 sm:text-[15px] sm:leading-6 lg:text-[16px]"
//               : "mt-3 text-[16px] leading-7 sm:text-[18px]"
//           }`}
//         >
//           {description}
//         </p>

//         {/* KNOW MORE */}
//         <Link
//           to={link}
//           className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#304b3c] font-semibold text-white transition-all duration-300 hover:bg-[#963D16] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963D16] ${
//             horizontal
//               ? "px-3 py-2 text-xs sm:mt-5 sm:px-4 sm:py-2.5 sm:text-sm"
//               : "mt-5 px-5 py-2.5 text-sm"
//           }`}
//         >
//           Know More
//           <ArrowRight
//             size={horizontal ? 14 : 16}
//             className="transition-transform group-hover:translate-x-1"
//             aria-hidden="true"
//           />
//         </Link>
//       </div>
//     </motion.article>
//   );
// }


// /* --------------------------------------------------
//    SECTION HEADING
// -------------------------------------------------- */

// function SectionHeading({
//   eyebrow,
//   title,
//   description,
//   icon: Icon,
// }) {
//   return (
//     <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
//       <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#476b55]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#476b55]">
//         {Icon && <Icon size={15} />}
//         {eyebrow}
//       </div>

//       <h2 className="text-2xl font-bold leading-tight text-[#263c30] sm:text-3xl lg:text-[36px]">
//         {title}
//       </h2>

//       {description && (
//         <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-[#333434] sm:text-[18px]">
//           {description}
//         </p>
//       )}

//       <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[#963D16]" />
//     </div>
//   );
// }

// /* --------------------------------------------------
//    SECTION VIEW ALL BUTTON
// -------------------------------------------------- */

// function SectionKnowMore({ to, label = "Know More" }) {
//   return (
//     <div className="mt-9 flex justify-center">
//       <Link
//         to={to}
//         className="inline-flex items-center gap-2 rounded-full bg-[#304b3c] px-7 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:bg-[#963D16] hover:shadow-md"
//       >
//         {label}
//         <ArrowRight size={17} />
//       </Link>
//     </div>
//   );
// }

// /* --------------------------------------------------
//    SERVICE SECTION
// -------------------------------------------------- */

// function ServiceSection({
//   id,
//   eyebrow,
//   title,
//   description,
//   items,
//   icon: Icon,
//   renderLink,
//   fallbackIcon,
//   background = "white",
//   columns = "lg:grid-cols-3",
//   limit,
//   sectionLink,
//   sectionButtonLabel = "Know More",
//   horizontal = false,
//   transparentHorizontal = false,
//   transparentVertical = false,
//   imageRight = false,
// }) {
//   const visibleItems = limit ? items.slice(0, limit) : items;

//   return (
//     <section
//       id={id}
//       className={`scroll-mt-28 py-14 sm:py-16 lg:py-[76px] ${
//         background === "mist" ? "bg-[#f4f7f2]" : "bg-white"
//       }`}
//     >
//       <div className="page-container px-4 sm:px-6 lg:px-8">
//         <SectionHeading
//           eyebrow={eyebrow}
//           title={title}
//           description={description}
//           icon={Icon}
//         />

//         <div
//   className={`grid grid-cols-1 gap-5 sm:gap-6 ${
//     horizontal
//       ? "md:grid-cols-2"
//       : `sm:grid-cols-2 ${columns}`
//   }`}
// >
//           {visibleItems.map((item, index) => (
//             <ServiceCard
//               key={item.slug || item.title}
//               item={item}
//               index={index}
//               link={renderLink(item)}
//               fallbackIcon={fallbackIcon}
//               horizontal={horizontal}
//               transparentHorizontal={transparentHorizontal}
//               transparentVertical={transparentVertical}
//               imageRight={imageRight}
//             />
//           ))}
//         </div>

//         {sectionLink && (
//           <SectionKnowMore
//             to={sectionLink}
//             label={sectionButtonLabel}
//           />
//         )}
//       </div>
//     </section>
//   );
// }

// /* --------------------------------------------------
//    MAIN SERVICES PAGE
// -------------------------------------------------- */

// export default function ServicesHubPage() {
//   return (
//     <main className="overflow-hidden bg-white">

//       {/* BREADCRUMB */}
// <nav
//   aria-label="Breadcrumb"
//   className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
//   style={{
//     backgroundImage: `url(${appointmentsWave})`,
//   }}
// >
//   <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
//     <ol className="flex flex-wrap items-center gap-2 text-[15px] sm:text-[16px]">
//       <li>
//         <Link
//           to="/"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
//         >
//           Home
//         </Link>
//       </li>

//       <li aria-hidden="true" className="text-white/90 drop-shadow-md">
//         /
//       </li>

//       <li
//         aria-current="page"
//         className="font-bold text-white drop-shadow-md"
//       >
//         Services
//       </li>
//     </ol>
//   </div>
// </nav>
//       {/* HERO */}
    

//       {/* 1. CANCER TYPES - ONLY 3 CARDS */}
//       <ServiceSection
//         id="cancer-types"
//         eyebrow="Understand Your Diagnosis"
//         title="Cancer Types"
//         description="Explore different types of cancer, their symptoms, diagnosis and available treatment approaches."
//         items={cancerTypes}
//         icon={HeartPulse}
//         fallbackIcon={HeartPulse}
//         renderLink={(item) => `/services/cancer/${item.slug}`}
//         background="mist"
//         columns="lg:grid-cols-3"
//         limit={3}
//       />
      
// {/* 2. SCREENING & DIAGNOSTICS */}
// <ServiceSection
//   id="screening-diagnostics"
//   eyebrow="Early Detection & Accurate Diagnosis"
//   title="Screening & Diagnostics"
//   description="Advanced screening and diagnostic services to support early detection, accurate diagnosis and informed treatment planning."
//   items={screeningDiagnosticServices}
//   icon={ScanLine}
//   fallbackIcon={ScanLine}
//   renderLink={(item) =>
//     `/services/screening-diagnostics/${item.slug}`
//   }
//   background="white"
//   horizontal={true}
// />


//       {/* 3. CANCER TREATMENTS - ONLY 4 CARDS + SECTION BUTTON */}
//       {/* <ServiceSection
//         id="cancer-treatments"
//         eyebrow="Personalised Treatment Options"
//         title="Cancer Treatments"
//         description="Discover specialised cancer treatments planned around each patient's diagnosis, clinical needs and individual care goals."
//         items={treatmentServices}
//         icon={Stethoscope}
//         fallbackIcon={Stethoscope}
//         renderLink={(item) => `/services/treatments/${item.slug}`}
//         background="mist"
//         columns="lg:grid-cols-4"
//         limit={4}
//         sectionLink="/services/treatments"
//         sectionButtonLabel="Know More"
//         transparentHorizontal={true}
//       /> */}
//       {/* 3. CANCER TREATMENTS */}
// <ServiceSection
//   id="cancer-treatments"
//   eyebrow="Personalised Treatment Options"
//   title="Cancer Treatments"
//   description="Discover specialised cancer treatments planned around each patient's diagnosis, clinical needs and individual care goals."
//   items={treatmentServices}
//   icon={Stethoscope}
//   fallbackIcon={Stethoscope}
//   renderLink={(item) => `/services/treatments/${item.slug}`}
//   background="mist"
//   columns="lg:grid-cols-4"
//   limit={4}
//   sectionLink="/services/treatments"
//   sectionButtonLabel="Know More"
  
// />

// {/* 4. TECHNOLOGY & EQUIPMENT */}
// <ServiceSection
//   id="technology"
//   eyebrow="Advanced Medical Innovation"
//   title="Technology & Equipment"
//   description="Explore the advanced technologies and equipment supporting precision, personalisation and quality in cancer care."
//   items={technologyItems}
//   icon={Cpu}
//   fallbackIcon={Cpu}
//   renderLink={(item) => item.path || `/technology/${item.slug}`}
//   background="white"
//   columns="lg:grid-cols-2"
//   limit={4}
//   sectionLink="/technology"
//   sectionButtonLabel="Know More"
//   horizontal={true}
//   transparentHorizontal={true}
//   imageRight={true}
// />
// {/* <ServiceSection
//   id="technology"
//   eyebrow="Advanced Medical Innovation"
//   title="Technology & Equipment"
//   description="Explore the advanced technologies and equipment supporting precision, personalisation and quality in cancer care."
//   items={technologyItems}
//   icon={Cpu}
//   fallbackIcon={Cpu}
//   renderLink={(item) => item.path || `/technology/${item.slug}`}
//   background="white"
//   columns="lg:grid-cols-4"
//   limit={4}
//   sectionLink="/technology"
//   sectionButtonLabel="Know More"
// /> */}

//       {/* 5. SECOND OPINION */}
//       <section
//         id="second-opinion"
//         className="scroll-mt-28 bg-[#f4f7f2] py-14 sm:py-16 lg:py-20"
//       >
//         <div className="page-container px-4 sm:px-6 lg:px-8">
//           <SectionHeading
//             eyebrow="Expert Guidance"
//             title="Second Opinion"
//             description="Get an additional expert perspective on your diagnosis and treatment plan to help you make informed decisions about your cancer care."
//             icon={ShieldCheck}
//           />

//           <div className="mx-auto max-w-4xl">
//             <motion.article
//               initial={{ opacity: 0, y: 22 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="group grid overflow-hidden rounded-2xl border border-[#e1e9df] bg-white shadow-[0_6px_25px_rgba(38,60,48,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[0.8fr_1.2fr]"
//             >
//               <div className="flex min-h-[230px] items-center justify-center bg-gradient-to-br from-[#304b3c] to-[#52745b] p-8">
//                 <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white">
//                   <MessageCircleHeart
//                     size={48}
//                     strokeWidth={1.4}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col justify-center p-6 sm:p-9">
//                 <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#A34116]">
//                   Expert Medical Guidance
//                 </span>

//                 <h3 className="mt-3 text-xl font-bold text-[#263c30] sm:text-2xl">
//                   Get a Second Opinion
//                 </h3>

//                 <p className="mt-3 text-[16px] leading-7 text-[#141414] sm:text-[18px]">
//                   Discuss your diagnosis, medical reports and proposed
//                   treatment plan with our cancer care specialists.
//                   Get further clarity and guidance for your next steps.
//                 </p>

//                 <Link
//                   to="/services/second-opinion"
//                   className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#304b3c] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#963D16]"
//                 >
//                   Know More
//                   <ArrowRight size={17} />
//                 </Link>
//               </div>
//             </motion.article>
//           </div>
//         </div>
//       </section>

//       {/* FINAL APPOINTMENT CTA */}
//       <section className="bg-[#263c30] py-12 sm:py-14">
//         <div className="page-container flex flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
//           <div>
//             <h2 className="text-2xl font-bold text-white sm:text-3xl">
//               Need Help Choosing the Right Care?
//             </h2>

//             <p className="mt-3 max-w-4xl text-[16px] leading-7 text-white/80 sm:text-[18px]">
//               Connect with our team to learn more about our services
//               and find the right next step for your care.
//             </p>
//           </div>

//           <Link
//             to="/appointments"
//             className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#963D16] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#d96836]"
//           >
//             Book an Appointment
//             <ArrowRight size={18} />
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// }





