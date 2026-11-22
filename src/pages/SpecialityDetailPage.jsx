import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  BriefcaseMedical,
  CalendarDays,
  HeartHandshake,
  Phone,
} from "lucide-react";

import CardSlider from "../components/CardSlider";
import { allTechnologyItems } from "../data/technologyData";

import {
  getSpecialityBySlug as getLocalSpecialityBySlug,
} from "../data/specialitiesData";

import {
  getSpecialityBySlug,
  mediaUrl,
} from "../api/specialitiesApi";
import { getPublicStories } from "../api/storiesApi";

import { getDoctors } from "../api/doctorsApi";
import { getSpecialityFaqs } from "../api/faqsApi";

import ContentVideoCarousel from "../components/ContentVideoCarousel";

import appointmentsWave from "../assets/appointments-wave.jpg";
// Existing local project images
// import assessmentImage from "../assets/home/assessment.jpg";
// import breastCareOneImage from "../assets/home/breastCare1.jpg";
// import breastCareTwoImage from "../assets/home/breastCare2.jpg";
// import breastScreeningImage from "../assets/home/breast-screening.jpg";
// import diagnosisImage from "../assets/home/diagnosis.jpg";
// import diagnosticImagingImage from "../assets/home/diagnostic-imaging.jpg";
// import medicalOncologyImage from "../assets/home/medical-oncology.jpg";
// import patientCareImage from "../assets/home/patientCare.jpg";
// import patientSupportImage from "../assets/home/patient-support.jpg";
// import radiationOncologyImage from "../assets/home/radiation-oncology.jpg";
// import surgicalOncologyImage from "../assets/home/surgical-oncology.jpg";
// import treatmentImage from "../assets/home/treatment.jpg";

// Three relevant images per speciality
// const specialityImages = {
//   "medical-oncology": [
//     medicalOncologyImage,
//     treatmentImage,
//     patientCareImage,
//   ],
//   "surgical-oncology": [
//     surgicalOncologyImage,
//     diagnosisImage,
//     treatmentImage,
//   ],
//   "radiation-oncology": [
//     radiationOncologyImage,
//     diagnosticImagingImage,
//     treatmentImage,
//   ],
//   "haemato-oncology": [
//     medicalOncologyImage,
//     patientCareImage,
//     assessmentImage,
//   ],
//   "gynaecological-oncology": [
//     breastCareTwoImage,
//     breastScreeningImage,
//     treatmentImage,
//   ],
//   "paediatric-oncology": [
//     patientCareImage,
//     patientSupportImage,
//     assessmentImage,
//   ],
//   "neuro-oncology": [
//     diagnosisImage,
//     diagnosticImagingImage,
//     radiationOncologyImage,
//   ],
//   "onco-radiology": [
//     diagnosticImagingImage,
//     diagnosisImage,
//     assessmentImage,
//   ],
//   "nuclear-medicine-theranostics": [
//     diagnosticImagingImage,
//     radiationOncologyImage,
//     treatmentImage,
//   ],
//   "interventional-oncology": [
//     diagnosisImage,
//     treatmentImage,
//     surgicalOncologyImage,
//   ],
//   "preventive-oncology": [
//     breastScreeningImage,
//     breastCareOneImage,
//     assessmentImage,
//   ],
//   "palliative-supportive-care": [
//     patientSupportImage,
//     patientCareImage,
//     breastCareTwoImage,
//   ],
// };

function getYouTubeId(url = "") {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      return (
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] ||
        ""
      );
    }

    return "";
  } catch {
    return "";
  }
}

export default function SpecialityDetailPage() {
  const { slug } = useParams();

  const reduceMotion = useReducedMotion();

  const localSpeciality = getLocalSpecialityBySlug(slug);

  const [apiSpeciality, setApiSpeciality] = useState(null);
  const [specialityLoading, setSpecialityLoading] = useState(true);

  const [doctors, setDoctors] = useState([]);
const [doctorsLoading, setDoctorsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchSpeciality = async () => {
      try {
        setSpecialityLoading(true);

        const data = await getSpecialityBySlug(slug);

        if (active) {
          setApiSpeciality(data);
        }
      } catch (error) {
        console.error("Speciality detail API error:", error);

        if (active) {
          setApiSpeciality(null);
        }
      } finally {
        if (active) {
          setSpecialityLoading(false);
        }
      }
    };

    fetchSpeciality();

    return () => {
      active = false;
    };
  }, [slug]);

  // FETCH DOCTORS FROM BACKEND API
useEffect(() => {
  let isActive = true;

  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const rows = await getDoctors({ limit: 100 });

      const formattedDoctors = rows.map((doctor) => {
        const specialityNames = Array.isArray(doctor.speciality_names)
          ? doctor.speciality_names
          : typeof doctor.speciality_names === "string"
            ? doctor.speciality_names
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean)
            : doctor.speciality_name
              ? [doctor.speciality_name]
              : [];

        return {
          ...doctor,
          specialityNames,
          speciality: specialityNames.join(", ") ||
            doctor.speciality_name ||
            "Oncology",
          image: mediaUrl(doctor.photo),
          experience: doctor.experience_years ?? 0,
          location: doctor.hospital_location || "",
        };
      });

      if (isActive) {
        setDoctors(formattedDoctors);
      }
    } catch (error) {
      console.error("Failed to load speciality doctors:", error);

      if (isActive) {
        setDoctors([]);
      }
    } finally {
      if (isActive) {
        setDoctorsLoading(false);
      }
    }
  };

  fetchDoctors();

  return () => {
    isActive = false;
  };
}, []);

  const speciality = apiSpeciality
  ? {
      ...localSpeciality,
      ...apiSpeciality,

      // Backend speciality name
      title: apiSpeciality.name || localSpeciality?.title,

      // Backend About content
      description: apiSpeciality.about_content || "",

      // Backend When to Consult
      whenToConsult: apiSpeciality.when_to_consult || "",

      // Backend About image
      aboutImage: mediaUrl(apiSpeciality.about_image),

      // Backend Care & Treatment Areas
      // careAreas: Array.isArray(apiSpeciality.highlights)
      //   ? apiSpeciality.highlights
      //   : [],
      careAreas: Array.isArray(apiSpeciality.highlights)
  ? apiSpeciality.highlights.filter(
      (item) => typeof item === "string" && item.trim()
    )
  : [],

      // Backend Sub-specialities
      subSpecialties: Array.isArray(apiSpeciality.subspecialities)
        ? apiSpeciality.subspecialities.map((item) =>
            typeof item === "string" ? item : item.name
          )
        : [],

      // Backend Gallery Images
      galleryImages: Array.isArray(apiSpeciality.gallery_images)
  ? apiSpeciality.gallery_images
      .map((image) => ({
        ...image,
        imageUrl: mediaUrl(image.image_path),
      }))
      .filter((image) => image.imageUrl)
  : [],
    }
  : localSpeciality;

  const [openFAQIndex, setOpenFAQIndex] = useState(0);
const [specialityFaqs, setSpecialityFaqs] = useState([]);
const [faqsLoading, setFaqsLoading] = useState(true);

const [patientStories, setPatientStories] = useState([]);


// FETCH FAQs FOR THE CURRENT SPECIALITY FROM BACKEND
useEffect(() => {
  let isActive = true;

  const fetchSpecialityFaqs = async () => {
    try {
      setFaqsLoading(true);
      setSpecialityFaqs([]);
      setOpenFAQIndex(0);

      // Use the speciality ID received from the backend
      const specialityId = apiSpeciality?.id;

      if (!specialityId) {
        if (isActive) {
          setSpecialityFaqs([]);
          setFaqsLoading(false);
        }
        return;
      }

      const rows = await getSpecialityFaqs(specialityId);

      if (isActive) {
        setSpecialityFaqs(
          Array.isArray(rows) ? rows : []
        );
      }
    } catch (error) {
      console.error("Speciality FAQs API error:", error);

      if (isActive) {
        setSpecialityFaqs([]);
      }
    } finally {
      if (isActive) {
        setFaqsLoading(false);
      }
    }
  };

  fetchSpecialityFaqs();

  return () => {
    isActive = false;
  };
}, [apiSpeciality?.id, slug]);


useEffect(() => {
  let isActive = true;

  const fetchPatientStories = async () => {
    try {
      const stories = await getPublicStories();

      // Match backend speciality name with current page speciality
      const normalizeName = (value = "") =>
        value.toLowerCase().replace(/[^a-z0-9]/g, "");

      const filteredStories = stories.filter((story) => {
        return (
          normalizeName(story.specialityName) ===
          normalizeName(speciality?.title)
        );
      });

      if (isActive) {
        setPatientStories(filteredStories);
      }
    } catch (error) {
      console.error("Patient stories API error:", error);

      if (isActive) {
        setPatientStories([]);
      }
    }
  };

  if (speciality?.title) {
    fetchPatientStories();
  }

  return () => {
    isActive = false;
  };
}, [speciality?.title]);


  if (specialityLoading) {
  return null;
}

if (!speciality) {
  return <Navigate to="/specialities" replace />;
}

  // Only show doctors whose speciality exactly matches this page.
  // NORMALIZE SPECIALITY NAMES
const normalizeSpeciality = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// CURRENT SPECIALITY NAME
const currentSpeciality = normalizeSpeciality(speciality.title);

// FILTER BACKEND DOCTORS BY SPECIALITY
const specialityDoctors = doctors.filter((doctor) => {
  const doctorSpecialities = doctor.specialityNames || [];

  return doctorSpecialities.some(
    (name) => normalizeSpeciality(name) === currentSpeciality
  );
});

  // Display only technologies related to the current speciality.
const specialityTechnologies = allTechnologyItems.filter((technology) =>
  technology.specialities?.includes(speciality.title)
);

const renderTechnologyCard = (technology) => (
  <Link
    to={`/technology/${technology.slug}`}
    // className="group flex h-full min-h-[410px] w-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium"
   className="group flex h-full min-h-[340px] w-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-premium sm:min-h-[380px]"
  >
    {/* TECHNOLOGY IMAGE */}
    <div className="relative h-36 shrink-0 overflow-hidden sm:h-44">
      <img
        src={technology.image}
        alt={technology.imageAlt || technology.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#263C30]/60 to-transparent" />

      <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#476B55]">
        {technology.category}
      </span>
    </div>

    {/* TECHNOLOGY CONTENT */}
    <div className="flex flex-1 flex-col p-3 sm:p-5">
     <h3 className="text-base font-bold leading-snug text-[#263C30] transition-colors group-hover:text-[#E87744] sm:text-lg">
        {technology.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-[#141414]sm:mt-3 sm:text-[17px] sm:leading-7">
        {technology.description}
      </p>

      <span className="mt-5 inline-flex min-h-10 items-center gap-2 self-start rounded-full bg-[#304B3C] px-5 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#E87744]">
        Know More
        <ArrowRight size={16} />
      </span>
    </div>
  </Link>
);

const testimonialVideos = patientStories.map((story) => ({
  id: story.id,
  title: story.title || "Patient Story",
  specialityName: story.specialityName || speciality.title,
  category: story.specialityName || speciality.title,
  youtubeId: story.youtubeId,
  video_url: story.video_url,
  href: story.href,
  thumbnail: story.thumbnail,
}));
// const testimonialVideos = patientStories.map((story) => ({
//   id: story.id,
//   title: story.title || story.patientName || "Patient Story",
//   category: story.specialityName || speciality.title,
//   href: story.href,
//   thumbnail: story.thumbnail,
// }));

  // Only show YouTube testimonial videos belonging to matching doctors.
// Patient stories fetched from backend for the current speciality.
// const testimonialVideos = patientStories
//   .map((story) => {
//     const videoUrl = story.video_url || story.youtube_url || "";
//     const videoId = getYouTubeId(videoUrl);

//     if (!videoId) return null;

//     return {
//       id: story.id,
//       title:
//         story.patient_name ||
//         story.title ||
//         "Patient Story",
//       category: speciality.title,
//       href: videoUrl,
//       thumbnail:
//         story.thumbnail ||
//         `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
//     };
//   })
//   .filter(Boolean);


  const doctorGridClass =
    specialityDoctors.length === 1
      ? "mx-auto grid max-w-sm grid-cols-1"
      : specialityDoctors.length === 2
        ? "mx-auto grid max-w-3xl grid-cols-1 sm:grid-cols-2"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    // <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-ink">
    <main className="flex min-h-screen flex-col overflow-hidden bg-[#fffdf9] text-ink">

      {/* BREADCRUMB */}
<nav
  aria-label="Breadcrumb"
  className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
  style={{
    backgroundImage: `url(${appointmentsWave})`,
  }}
>
  <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
    <ol className="flex flex-wrap items-center gap-2 text-base">
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

      <li>
        <Link
          to="/specialities"
          className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#E87744]"
        >
          Specialities
        </Link>
      </li>

      <li aria-hidden="true" className="text-white/90 drop-shadow-md">
        /
      </li>

      <li
        aria-current="page"
        className="font-bold text-white drop-shadow-md"
      >
        {speciality.title}
      </li>
    </ol>
  </div>
</nav>


      {/* About speciality */}
      {/* <section className="w-full px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"> */}
      {/* About speciality - show only when content exists */}
{(
  speciality.description?.trim() ||
  speciality.aboutImage ||
  speciality.whenToConsult?.trim()
) && (
<section className="w-full px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Center heading - no repeated heading on the left */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="mx-auto mb-10 max-w-4xl text-center sm:mb-14"
        >
          <span className="text-sm font-bold tracking-[0.18em] text-sky sm:text-base">
            SPECIALITY OVERVIEW
          </span>

          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl">
            {speciality.title}
          </h1>

          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#e87744]" />
        </motion.div>

        {/* Left content and right image */}
        <div className="mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
          >
            <h2 className="font-display text-2xl font-bold leading-snug text-royal sm:text-3xl">
              {speciality.heading}
            </h2>

            <p className="mt-6 text-base leading-8 text-[#141414] sm:text-lg sm:leading-9">
              {speciality.description}
            </p>

            {speciality.whenToConsult && (
              <motion.div
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduceMotion ? 0 : 0.5 }}
                className="mt-8 rounded-2xl border border-line bg-mist p-5 shadow-sm sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-royal shadow-sm">
                    <HeartHandshake size={23} />
                  </span>

                  <h3 className="font-display text-xl font-bold text-navy sm:text-2xl">
                    When to Consult
                  </h3>
                </div>

                <p className="mt-4 text-base leading-8 text-[#141414] sm:text-lg">
                  {speciality.whenToConsult}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              delay: 0.1,
            }}
            className="relative"
          >
            <motion.div
              whileHover={reduceMotion ? {} : { y: -7 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden rounded-[2rem] border border-line bg-white p-2 shadow-[0_18px_45px_rgba(38,59,80,0.13)]"
            >
              {speciality.aboutImage && (
  <img
    src={speciality.aboutImage}
    alt={`${speciality.title} care`}
    className="h-[280px] w-full rounded-[1.5rem] object-cover sm:h-[380px] lg:h-[460px]"
  />
)}
            </motion.div>

            <div className="absolute -bottom-5 -left-5 -z-10 h-28 w-28 rounded-[2rem] bg-[#e8f0ea] sm:h-36 sm:w-36" />
            <div className="absolute -right-3 -top-3 -z-10 h-20 w-20 rounded-full bg-[#fff1e9] sm:h-28 sm:w-28" />
          </motion.div>
        </div>
      </section>
    )}

      {/* Sub-specialities */}
      {speciality.subSpecialties?.length > 0 && (
        <section className="bg-mist px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1500px]">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-bold tracking-[0.16em] text-sky sm:text-base">
                AREAS OF FOCUS
              </span>

              <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
                Sub-specialities
              </h2>
            </div>

            {/* <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"> */}
            <div className="mt-9 flex flex-wrap justify-center gap-5">
              {speciality.subSpecialties.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 18,
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: reduceMotion ? 0 : index * 0.05,
                  }}
                  whileHover={reduceMotion ? {} : { y: -5 }}
                  className="flex min-h-[76px] w-fit max-w-full items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-sm transition duration-300 hover:border-royal hover:shadow-md"
                  // className="flex min-h-[76px] items-center gap-4 rounded-2xl border border-line bg-white px-5 py-5 shadow-sm transition duration-300 hover:border-royal hover:shadow-md"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff1e9] text-sky">
                    <ArrowRight size={19} />
                  </span>

                  <span className="text-base font-semibold leading-7 text-navy sm:text-lg">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Care & Treatment Areas */}
      {/* <section className="w-full px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20"> */}
      {/* Care & Treatment Areas - show only when data exists */}
{(
  (speciality.careAreas?.length > 0) ||
  (speciality.galleryImages?.length > 0)
) && (
<section className="w-full px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div
  className={`mx-auto max-w-[1500px] items-center gap-10 lg:gap-14 ${
    speciality.galleryImages?.length > 0
      ? "grid lg:grid-cols-[1fr_0.95fr]"
      : "grid grid-cols-1"
  }`}
>
        {/* <div className="mx-auto grid max-w-[1500px] items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-14"> */}

          {/* Treatment points */}
          <motion.div
            initial={{ opacity: 0, x: reduceMotion ? 0 : -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
          >
            <span className="text-sm font-bold tracking-[0.16em] text-sky sm:text-base">
              OUR CLINICAL SERVICES
            </span>

            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
              Care &amp; Treatment Areas
            </h2>

            <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {/* {speciality.careAreas.map((area, index) => ( */}
              {(speciality.careAreas || [])
                .filter((area) => area?.trim())
                .map((area, index) => (
                <motion.li
                  key={area}
                  initial={{
                    opacity: 0,
                    x: reduceMotion ? 0 : -12,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : index * 0.035,
                  }}
                  className="flex items-start gap-3 border-b border-[#e8ece6] pb-4 text-base leading-7 text-[#141414] sm:text-[17px]"
                >
                  <CheckCircle2
                    size={21}
                    className="mt-1 shrink-0 text-royal"
                  />
                  <span>{area}</span>
                </motion.li>
              ))}
            </ul>

            {speciality.note && (
              <p className="mt-6 rounded-xl border-l-4 border-sky bg-[#fff8f3] p-5 text-base leading-8 text-[#647368] sm:text-lg">
                {speciality.note}
              </p>
            )}
          </motion.div>

          {/* Treatment images */}
          
{/* Treatment Gallery Images - Backend */}
{speciality.galleryImages?.length > 0 && (
  <div
    className={`grid gap-4 sm:gap-5 ${
      speciality.galleryImages.length === 1
        ? "grid-cols-1"
        : "grid-cols-2"
    }`}
  >
    {speciality.galleryImages.map((image, index) => {
      const totalImages = speciality.galleryImages.length;

      const isLargeImage = totalImages === 3 && index === 0;

      return (
        <motion.div
          key={image.id || image.image_path}
          whileHover={reduceMotion ? {} : { y: -7, scale: 1.01 }}
          transition={{ duration: 0.3 }}
          className={`overflow-hidden rounded-[1.5rem] border border-line bg-white p-1.5 shadow-md ${
            isLargeImage ? "row-span-2" : ""
          }`}
        >
          <img
            src={image.imageUrl}
            alt={
              image.alt_text ||
              `${speciality.title} clinical care ${index + 1}`
            }
            loading="lazy"
            className={`w-full rounded-[1.1rem] object-cover ${
              totalImages === 1
                ? "h-[300px] sm:h-[410px]"
                : totalImages === 2
                  ? "h-[220px] sm:h-[300px]"
                  : isLargeImage
                    ? "h-full min-h-[300px] sm:min-h-[410px]"
                    : totalImages === 3
                      ? "h-[140px] sm:h-[195px]"
                      : "h-[160px] sm:h-[210px]"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
        </div>
      </section>
    )}


     {/* SPECIALITY RELATED TECHNOLOGIES */}
{specialityTechnologies.length > 0 && (
  // <section className="section-padding overflow-hidden bg-mist">
  //   <div className="page-container px-5 sm:px-8 lg:px-12">
  <section className="overflow-hidden bg-mist py-10 sm:py-14 lg:py-16">
  <div className="mx-auto w-full max-w-[1500px] px-1 sm:px-5 lg:px-8">

      {/* SECTION HEADING */}
      <motion.div
        initial={{
          opacity: 0,
          y: reduceMotion ? 0 : 20,
        }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-10 max-w-3xl text-center"
      >
        <span className="text-sm font-bold tracking-[0.16em] text-sky">
          ADVANCED TECHNOLOGY
        </span>

        <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
          Technologies for {speciality.title}
        </h2>

        <p className="mt-4 text-base leading-7 text-[#323232]">
          Explore the technologies associated with this speciality
          and learn how they support diagnosis and treatment.
        </p>
      </motion.div>

      {/* 1 OR 2 TECHNOLOGIES - CENTERED CARDS */}
{specialityTechnologies.length <= 2 ? (
  <div className="mx-auto flex flex-wrap justify-center gap-4">
    {specialityTechnologies.map((technology) => (
      <div
        key={technology.slug}
        className="w-full max-w-[420px] sm:w-[calc(50%-8px)]"
      >
        {renderTechnologyCard(technology)}
      </div>
    ))}
  </div>
) : (
  <CardSlider
    items={specialityTechnologies}
    ariaLabel={`${speciality.title} technologies`}
    renderItem={renderTechnologyCard}
  />
)}

    </div>
  </section>
)}

      {/* Full-width Contact / Appointment CTA */}
      {/* <section className="w-full "> */}
      <section className="flex w-full flex-1 items-center">
        <motion.div
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 30,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.65 }}
          whileHover={reduceMotion ? {} : { y: -3 }}
          className="relative my-6 w-full overflow-hidden border border-[#b8d2bd] bg-gradient-to-r from-[#0f3013] via-[#162b17] to-[#052601] px-6 py-9 shadow-[0_12px_35px_rgba(48,91,58,0.12)] sm:my-8 sm:px-12 sm:py-12 lg:px-24 lg:py-14"
          // className="relative w-full overflow-hidden border border-[#b8d2bd] bg-gradient-to-r from-[#0f3013] via-[#162b17] to-[#052601] px-6 py-9 shadow-[0_12px_35px_rgba(48,91,58,0.12)] sm:px-12 sm:py-13 lg:px-24 lg:py-14"
        >
         
          <div className="relative z-10 flex flex-col items-center gap-7 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">

           <div className="mx-auto w-full max-w-3xl lg:mx-0">
              <span className="text-sm font-bold tracking-[0.16em] text-[#df5f14] sm:text-base">
                WE ARE HERE TO HELP
              </span>

              <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-[#f8f6f4] sm:text-3xl lg:text-4xl">
                Need guidance about {speciality.title}?
              </h2>

              <p className="mt-4 text-base leading-8 text-[#d4d7d5] sm:text-lg">
                Contact our team or request an appointment to discuss the next
                steps in your care. Our team is here to help guide you through
                your treatment journey.
              </p>
            </div>

           <div className="flex w-full shrink-0 flex-row items-center justify-center gap-2 sm:w-auto lg:justify-start lg:gap-3">
              <Link
                to="/contact"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-[#477653] bg-white px-2 py-3 text-[12px] font-bold text-[#477653] shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-[#477653] hover:text-white hover:shadow-lg sm:w-auto sm:flex-none sm:gap-2 sm:px-4 sm:text-sm lg:px-7 lg:text-base"
              >
                <Phone size={18} />
                Contact Us
              </Link>

              <Link
                to="/appointments"
                className="inline-flex min-w-0 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-[#477653] px-2 py-3 text-[12px] font-bold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#365e40] hover:shadow-lg sm:w-auto sm:flex-none sm:gap-2 sm:px-4 sm:text-sm lg:px-7 lg:text-base"
              >
                <CalendarDays size={18} />
                Book an Appointment
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Matching speciality doctors only */}
      {/* {specialityDoctors.length > 0 && ( */}
      {!doctorsLoading && specialityDoctors.length > 0 && (
        <section className="bg-[#f6f9f6] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-[1500px]">

            <div className="text-center">
              <span className="text-sm font-bold tracking-[0.16em] text-sky sm:text-base">
                MEET THE EXPERTS
              </span>

              <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
                {speciality.title} Doctors
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#363737] sm:text-lg">
                Meet the specialists for this department and explore their
                profiles, experience and areas of expertise.
              </p>
            </div>

            <div className={`mt-10 gap-6 ${doctorGridClass}`}>
              {specialityDoctors.map((doctor, index) => (
                <motion.article
                  key={doctor.id}
                  initial={{
                    opacity: 0,
                    y: reduceMotion ? 0 : 22,
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.45,
                    delay: reduceMotion ? 0 : index * 0.07,
                  }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-premium"
                >
                  <Link
                    to={`/doctors/${doctor.slug}`}
                    aria-label={`View ${doctor.name} profile`}
                    className="block overflow-hidden bg-ice"
                  >
                    <div className="h-[255px] overflow-hidden sm:h-[245px] lg:h-[265px]">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className="font-display text-xl font-bold leading-snug text-navy">
                      {doctor.name}
                    </h3>

                    <p className="mt-1 text-base leading-7 text-[#647368]">
                      {doctor.designation}
                    </p>

                    <p className="mt-1 text-base font-semibold leading-7 text-royal">
                      {doctor.speciality}
                    </p>

                    <div className="mt-1 space-y-1 text-base text-[#647368]">
                      <p className="flex items-start gap-2">
                        <BriefcaseMedical
                          size={18}
                          className="mt-1 shrink-0 text-royal"
                        />
                        <span>{doctor.experience}+ Years Experience</span>
                      </p>

                      <p className="flex items-start gap-2">
                        <MapPin
                          size={18}
                          className="mt-1 shrink-0 text-royal"
                        />
                        <span>{doctor.location}</span>
                      </p>
                    </div>

                    <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                      <Link
                        to={`/doctors/${doctor.slug}`}
                        className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full border border-royal px-2 py-2 text-center text-sm font-bold text-royal transition hover:bg-royal hover:text-white"
                      >
                        View Profile
                        <ArrowRight size={15} />
                      </Link>

                      <Link
                        to={`/appointments?doctor=${encodeURIComponent(doctor.name)}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-royal px-2 py-2 text-center text-sm font-bold text-white transition hover:bg-royaldeep"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Patient testimonial videos */}
      {testimonialVideos.length > 0 && (
        <ContentVideoCarousel
          eyebrow="PATIENT STORIES"
          title={`${speciality.title} – Patient Testimonials`}
          subtitle="Watch patient stories shared by people connected with this speciality."
          items={testimonialVideos}
          slidesPerView={4}
          autoPlay
          interval={4500}
          background="white"
        />
      )}


      {/* SPECIALITY FAQs */}
      {/* {speciality.faqs?.length > 0 && ( */}
      {!faqsLoading && specialityFaqs.length > 0 && (
        <section className="bg-mist px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="mx-auto max-w-5xl">

            <div className="mb-9 text-center">
              <span className="text-sm font-bold tracking-[0.16em] text-sky sm:text-base">
                HAVE QUESTIONS?
              </span>

              <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
                Frequently Asked Questions
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#3c3c3c]">
                Find answers to common questions about {speciality.title},
                diagnosis and treatment options.
              </p>
            </div>

            <div className="space-y-3">
              {/* {speciality.faqs.map((faq, index) => { */}
              {specialityFaqs.map((faq, index) => {
                const isOpen = openFAQIndex === index;

                return (
                  <div
                    // key={index}
                    key={faq.id || index}
                    className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                      isOpen
                        ? "border-royal shadow-sm"
                        : "border-line hover:border-royal"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFAQIndex(isOpen ? -1 : index)
                      }
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="flex items-start gap-3">
                        <span className="shrink-0 text-base font-bold text-sky">
                          {String(index + 1).padStart(2, "0")}.
                        </span>

                        <span className="text-base font-semibold leading-7 text-navy sm:text-lg">
                          {faq.question}
                        </span>
                      </span>

                      <ArrowRight
                        size={20}
                        className={`shrink-0 text-royal transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-line px-5 pb-5 pt-4 sm:px-6">
                        <p className="pl-8 text-[15px] leading-7 text-[#141414] sm:text-[18px]">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}
    </main>
  );
}



