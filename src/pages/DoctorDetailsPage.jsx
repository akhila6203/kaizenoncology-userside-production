import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  MapPin,
  GraduationCap,
  BriefcaseMedical,
  Award,
  BookOpen,
  Languages,
  ArrowRight,
  UserRound,
  Stethoscope,
  Users,
  Microscope,
  BadgeCheck,
} from "lucide-react";

import { getPublicStories } from "../api/storiesApi";
import { getDoctors, getDoctorById } from "../api/doctorsApi";
import { mediaUrl } from "../api/specialitiesApi";
import DOMPurify from "dompurify";

import ContentVideoCarousel from "../components/ContentVideoCarousel";
import appointmentsWave from "../assets/appointments-wave.jpg";

// SECTION ORDER - RIGHT SIDE
const tabs = [
  { id: "about", label: "Profile", icon: UserRound },
  { id: "expertise", label: "Area of Expertise", icon: Stethoscope, field: "expertise" },
  { id: "experience", label: "Professional Experience", icon: BriefcaseMedical, field: "professionalExperience" },
  { id: "awards", label: "Awards & Recognition", icon: Award, field: "awards" },
  { id: "conferences", label: "Conferences & Workshops", icon: Users, field: "conferences" },
  { id: "membership", label: "Fellow Membership", icon: BadgeCheck, field: "memberships" },
  { id: "research", label: "Research & Publications", icon: BookOpen, field: "research" },
  { id: "procedures", label: "Procedures & Treatments", icon: Microscope, field: "procedures" },
];

// Extract YouTube video ID
function isValidYoutube(url) {
  if (!url) return true;

  try {
    const parsedUrl = new URL(String(url).trim());

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return false;
    }

    const hostname = parsedUrl.hostname
      .toLowerCase()
      .replace(/^www\./, "");

    return (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtu.be"
    );
  } catch {
    return false;
  }
}

function getYouTubeId(url = "") {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.slice(1).split("/")[0];
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      const parts = parsedUrl.pathname.split("/");

      if (["embed", "shorts", "live"].includes(parts[1])) {
        return parts[2];
      }
    }

    return null;
  } catch {
    return null;
  }
}

// FORMAT DOCTOR API DATA
function formatDoctorDetails(data = {}) {
  const specialityNames = Array.isArray(data.speciality_names)
    ? data.speciality_names
    : typeof data.speciality_names === "string"
      ? data.speciality_names
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
      : data.speciality_name
        ? [data.speciality_name]
        : [];

  const youtubeVideos = Array.isArray(data.youtube_videos)
    ? data.youtube_videos
    : data.youtube_url
      ? [data.youtube_url]
      : [];

  const qualifications = Array.isArray(data.qualifications)
    ? data.qualifications
    : [];

  const expertise = Array.isArray(data.expertise)
    ? data.expertise
    : [];

  const formatVideos = youtubeVideos
    .map((video, index) => ({
      youtubeUrl:
        typeof video === "string"
          ? video
          : video?.youtubeUrl || video?.url || video?.video_url || "",
      title:
        typeof video === "string"
          ? `Health Talk ${index + 1}`
          : video?.title || `Health Talk ${index + 1}`,
      thumbnail:
        typeof video === "object" && video !== null
          ? video.thumbnail || ""
          : "",
    }))
    .filter((video) => video.youtubeUrl);

  const toList = (value) =>
    Array.isArray(value)
      ? value
      : typeof value === "string" && value.trim()
        ? [value.trim()]
        : [];

  return {
    ...data,

    specialityNames,

    specialityIds: Array.isArray(data.speciality_ids)
      ? data.speciality_ids
      : [],

    speciality: specialityNames.join(", ") || data.speciality_name || "Oncology",

    image: mediaUrl(data.photo),
    location: data.hospital_location || "",
    experience: data.experience_years ?? 0,

    qualifications,
    education: qualifications,

    professionalExperience: toList(data.professional_experience),
    conferences: toList(data.conferences_workshops),
    awards: toList(data.awards_recognition),
    memberships: toList(data.fellowship_memberships),
    expertise,
    research: toList(data.research_publications),
    procedures: toList(data.procedures_treatments),
    languages: toList(data.languages),

    cancerSpecialties: expertise,
    healthTalk: formatVideos,
  };
}

export default function DoctorDetailsPage() {
  const { slug } = useParams();

  const [patientStories, setPatientStories] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH DOCTOR BY SLUG, THEN FETCH FULL DETAILS BY ID
  useEffect(() => {
    let isActive = true;

    const loadDoctor = async () => {
      try {
        setLoading(true);
        setDoctor(null);

        const doctorsList = await getDoctors({ limit: 100 });

        const selectedDoctor = doctorsList.find(
          (item) => item.slug === slug
        );

        if (!selectedDoctor) {
          if (isActive) setDoctor(null);
          return;
        }

        const details = await getDoctorById(selectedDoctor.id);

        if (isActive) {
          setDoctor(formatDoctorDetails(details));
        }
      } catch (error) {
        console.error("Failed to load doctor details:", error);

        if (isActive) {
          setDoctor(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadDoctor();

    return () => {
      isActive = false;
    };
  }, [slug]);

  // FETCH PATIENT STORIES BASED ON DOCTOR SPECIALITY
  useEffect(() => {
    let isActive = true;

    const loadPatientStories = async () => {
      try {
        setPatientStories([]);

        const stories = await getPublicStories();

        const normalizeName = (value = "") =>
          String(value)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

        const doctorSpecialityNames = (
          doctor?.specialityNames?.length
            ? doctor.specialityNames
            : [doctor?.speciality_name || doctor?.speciality]
        )
          .map(normalizeName)
          .filter(Boolean);

        const doctorSpecialityIds = (
          doctor.specialityIds || doctor.speciality_ids || []
        ).map(Number);

        const filteredStories = stories
          .filter((story) => {
            if (!story.youtubeId) return false;

            const storySpecialityId = Number(story.speciality_id);

            const matchesById =
              storySpecialityId > 0 &&
              doctorSpecialityIds.includes(storySpecialityId);

            const storySpecialityName = normalizeName(
              story.specialityName || story.speciality_name
            );

            const matchesByName =
              storySpecialityName &&
              doctorSpecialityNames.includes(storySpecialityName);

            return matchesById || matchesByName;
          })
          .map((story) => ({
            id: story.id,
            title: story.title || story.patientName || "Patient Story",
            category: story.specialityName || "Patient Story",
            youtubeId: story.youtubeId,
            href:
              story.href ||
              story.video_url ||
              `https://www.youtube.com/watch?v=${story.youtubeId}`,
            thumbnail:
              story.thumbnail ||
              `https://img.youtube.com/vi/${story.youtubeId}/hqdefault.jpg`,
          }));

        if (isActive) {
          setPatientStories(filteredStories);
        }
      } catch (error) {
        console.error("Failed to load speciality patient stories:", error);

        if (isActive) {
          setPatientStories([]);
        }
      }
    };

    if (doctor?.id) {
      loadPatientStories();
    }

    return () => {
      isActive = false;
    };
  }, [doctor]);

  // LOADING
  if (loading) {
    return (
      <main className="page-container min-h-[60vh] px-5 py-20 text-center">
        <p className="text-base text-[#718075]">
          Loading doctor profile...
        </p>
      </main>
    );
  }

  // DOCTOR NOT FOUND
  if (!doctor) {
    return (
      <main className="page-container min-h-[60vh] px-5 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-navy">
          Doctor profile not found
        </h1>

        <Link
          to="/doctors"
          className="mt-5 inline-flex rounded-full bg-royal px-6 py-3 font-semibold text-white hover:bg-royaldeep"
        >
          Back to Doctors
        </Link>
      </main>
    );
  }

  const aboutContent = doctor.about || doctor.short_bio || "";
  const safeAboutContent = DOMPurify.sanitize(aboutContent);

  // HEALTH TALK VIDEOS
  const healthTalkItems = (
    Array.isArray(doctor.healthTalk)
      ? doctor.healthTalk
      : doctor.healthTalk?.youtubeUrl
        ? [doctor.healthTalk]
        : []
  )
    .map((video) => {
      const videoId = getYouTubeId(video.youtubeUrl);

      if (!videoId) return null;

      return {
        title: video.title || "Doctor Health Talk",
        category: doctor.speciality,
        href: video.youtubeUrl,
        thumbnail:
          video.thumbnail ||
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    })
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#FFFDFA] text-ink">

      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="relative w-full overflow-hidden border-b border-[#DCE5DA] bg-cover bg-center"
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
                to="/doctors"
                className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#E87744]"
              >
                Doctors
              </Link>
            </li>

            <li aria-hidden="true" className="text-white/90 drop-shadow-md">
              /
            </li>

            <li
              aria-current="page"
              className="font-bold text-white drop-shadow-md"
            >
              {doctor.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* =========================================
          DOCTOR PROFILE - LEFT STICKY / RIGHT SCROLL
      ========================================== */}

      <section className="w-full bg-[#FFFDFA]">
        <div className="page-container grid grid-cols-1 items-start gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-8 lg:px-12 lg:py-8">

          {/* =====================================
              LEFT SIDE - STICKY SIDEBAR
          ====================================== */}

          <aside className="w-full lg:sticky lg:top-[100px] lg:self-start">
            <div className="rounded-xl border border-[#DCE8DC] bg-[#F1F6F0] p-5 sm:p-6">

              {/* DOCTOR NAME */}

              <h1 className="font-display text-xl font-extrabold leading-snug text-[#304B3C] sm:text-2xl">
                {doctor.name}
              </h1>

              {doctor.designation && (
                <p className="mt-2 text-sm leading-6 text-[#141414] sm:text-base">
                  {doctor.designation}
                </p>
              )}

              {/* SPECIALITIES */}

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 border-b border-[#C8D9CB] pb-2">
                  <Stethoscope size={18} className="shrink-0 text-[#E87744]" />

                  <h2 className="font-display text-base font-bold uppercase tracking-wide text-[#304B3C]">
                    Specialities
                  </h2>
                </div>

                <ul className="space-y-2">
                  {(doctor.specialityNames?.length
                    ? doctor.specialityNames
                    : [doctor.speciality || "Oncology"]
                  ).map((speciality, index) => (
                    <li
                      key={`speciality-${index}`}
                      className="flex items-start gap-2 text-sm leading-6 text-black sm:text-base"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87744]" />

                      <span className="min-w-0 flex-1 break-words">
                        {speciality}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PROFESSIONAL DETAILS */}

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 border-b border-[#C8D9CB] pb-2">
                  <MapPin size={18} className="shrink-0 text-[#E87744]" />

                  <h2 className="font-display text-base font-bold uppercase tracking-wide text-[#304B3C]">
                    Professional Details
                  </h2>
                </div>

                <div className="space-y-4">

                  {/* EXPERIENCE */}

                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-black sm:text-base">
                      <BriefcaseMedical size={16} className="shrink-0 text-[#476B55]" />
                      Experience
                    </p>

                    <p className="mt-1 pl-6 text-sm leading-6 text-black sm:text-base">
                      {doctor.experience || 0} Years
                    </p>
                  </div>

                  {/* LOCATION */}

                  {doctor.location && (
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium text-black sm:text-base">
                        <MapPin size={16} className="shrink-0 text-[#476B55]" />
                        Hospital / Location
                      </p>

                      <p className="mt-1 break-words pl-6 text-sm leading-6 text-black sm:text-base">
                        {doctor.location}
                      </p>
                    </div>
                  )}

                  {/* LICENSE NUMBER */}

                  {(doctor.license_number ||
                    doctor.license ||
                    doctor.registration_number ||
                    doctor.medical_registration_number) && (
                    <div>
                      <p className="flex items-center gap-2 text-sm font-medium text-black sm:text-base">
                        <BadgeCheck size={16} className="shrink-0 text-[#476B55]" />
                        License Number
                      </p>

                      <p className="mt-1 break-all pl-6 text-sm leading-6 text-black sm:text-base">
                        {doctor.license_number ||
                          doctor.license ||
                          doctor.registration_number ||
                          doctor.medical_registration_number}
                      </p>
                    </div>
                  )}

                </div>
              </div>

              {/* EDUCATION & TRAINING */}

              {doctor.qualifications?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 border-b border-[#C8D9CB] pb-2">
                    <GraduationCap size={19} className="shrink-0 text-[#E87744]" />

                    <h2 className="font-display text-base font-bold uppercase tracking-wide text-[#304B3C]">
                      Education & Training
                    </h2>
                  </div>

                  <ul className="space-y-2">
                    {doctor.qualifications.map((qualification, index) => (
                      <li
                        key={`qualification-${index}`}
                        className="flex items-start gap-2 text-sm leading-6 text-black sm:text-base"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87744]" />

                        <span className="min-w-0 flex-1 break-words">
                          {qualification}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* LANGUAGES */}

              {doctor.languages?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-2 border-b border-[#C8D9CB] pb-2">
                    <Languages size={18} className="shrink-0 text-[#E87744]" />

                    <h2 className="font-display text-base font-bold uppercase tracking-wide text-[#304B3C]">
                      Languages
                    </h2>
                  </div>

                  <ul className="space-y-2">
                    {doctor.languages.map((language, index) => (
                      <li
                        key={`language-${index}`}
                        className="flex items-start gap-2 text-sm leading-6 text-black sm:text-base"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87744]" />

                        <span className="min-w-0 flex-1 break-words">
                          {language}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* BOOK APPOINTMENT */}

              <Link
                to={`/appointments?doctor=${encodeURIComponent(doctor.name)}`}
                className="mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#304B3C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#476B55] sm:text-base"
              >
                Book An Appointment
                <ArrowRight size={17} />
              </Link>

            </div>
          </aside>

          {/* =====================================
              RIGHT SIDE - PROFILE CONTENT
          ====================================== */}

          <div className="min-w-0 lg:pr-3">

           {/* DOCTOR IMAGE */}
          {doctor.image && (
            <div className="mb-7 w-full overflow-hidden rounded-lg bg-[#F1F6F0] sm:w-1/2">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-[220px] w-full object-cover object-top sm:h-[280px] lg:h-[320px]"
              />
            </div>
          )}

            {/* PROFILE */}

            <section className="pb-7 sm:pb-8">
              <div className="flex items-center gap-3 border-b border-[#C8D9CB] pb-3">
                <UserRound size={19} className="shrink-0 text-[#E87744]" />

                <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#304B3C] sm:text-xl">
                  Profile
                </h2>
              </div>

              <div
                className="
                  mt-4 break-words text-base leading-7 !text-[#141414]
                    sm:text-[17px] sm:leading-8 lg:text-lg
                    [&_p]:mb-4 [&_p:last-child]:mb-0
                    [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc
                    [&_ol]:mb-4 [&_ol]:ml-5 [&_ol]:list-decimal
                    [&_li]:mb-1
                    [&_strong]:font-bold [&_strong]:text-black
                    [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-black
                    [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-black
                  "
              >
                {safeAboutContent ? (
                  <div dangerouslySetInnerHTML={{ __html: safeAboutContent }} />
                ) : (
                  <p>Doctor profile information will be updated soon.</p>
                )}
              </div>
            </section>

            {/* OTHER DOCTOR DETAILS */}

            {tabs
              .filter((tab) => tab.id !== "about")
              .map((tab) => {
                const Icon = tab.icon;
                const items = tab.field ? doctor[tab.field] || [] : [];

                if (!items.length) return null;

                return (
                  <section
                      key={tab.id}
                      className="py-6 sm:py-7"
                    >
                    {/* SECTION HEADING */}

                    <div className="flex items-center gap-3 border-b border-[#C8D9CB] pb-3">
                      <Icon size={19} className="shrink-0 text-[#E87744]" />

                      <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#304B3C] sm:text-xl">
                        {tab.label}
                      </h2>
                    </div>

                    {/* SECTION LIST */}

                    <ul className="mt-4 space-y-3">
                      {items.map((item, itemIndex) => (
                        <li
                          key={`${tab.id}-${itemIndex}`}
                          className="flex items-start gap-3 text-base leading-7 text-black sm:text-[17px] sm:leading-8 lg:text-lg"
                        >
                          <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87744]" />

                          <span className="min-w-0 flex-1 break-words">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}

          </div>
        </div>
      </section>

      {/* DOCTOR HEALTH TALKS */}

      {healthTalkItems.length > 0 && (
        <ContentVideoCarousel
          eyebrow="WATCH & LEARN"
          title="Doctor Health Talk"
          subtitle={`Cancer awareness and treatment guidance from ${doctor.name}.`}
          items={healthTalkItems}
          slidesPerView={4}
          autoPlay={false}
        />
      )}

      {/* PATIENT STORIES BASED ON DOCTOR SPECIALITY */}

      {patientStories.length > 0 && (
        <ContentVideoCarousel
          eyebrow="PATIENT STORIES"
          title={`${doctor.speciality} – Patient Testimonials`}
          subtitle={`Patient experiences and stories related to ${doctor.speciality}.`}
          items={patientStories}
          slidesPerView={4}
          autoPlay
          interval={4500}
          background="white"
        />
      )}

    </main>
  );
}























// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import {
//   MapPin,
//   GraduationCap,
//   BriefcaseMedical,
//   Award,
//   BookOpen,
//   Languages,
//   ArrowRight,
//   UserRound,
//   Stethoscope,
//   Users,
//   Microscope,
//   BadgeCheck,
// } from "lucide-react";

// import { getPublicStories } from "../api/storiesApi";
// import { getDoctors, getDoctorById } from "../api/doctorsApi";
// import { mediaUrl } from "../api/specialitiesApi";
// import DOMPurify from "dompurify";

// import ContentVideoCarousel from "../components/ContentVideoCarousel";
// import appointmentsWave from "../assets/appointments-wave.jpg";

// const tabs = [
//   { id: "about", label: "About Doctor", icon: UserRound },
//   { id: "education", label: "Education & Training", icon: GraduationCap, field: "education" },
//   { id: "experience", label: "Professional Experience", icon: BriefcaseMedical, field: "professionalExperience" },
//   { id: "conferences", label: "Conferences & Workshops", icon: Users, field: "conferences" },
//   { id: "awards", label: "Awards & Recognition", icon: Award, field: "awards" },
//   { id: "membership", label: "Fellow Membership", icon: BadgeCheck, field: "memberships" },
//   { id: "expertise", label: "Areas of Expertise", icon: Stethoscope, field: "expertise" },
//   { id: "research", label: "Research & Publications", icon: BookOpen, field: "research" },
//   { id: "procedures", label: "Procedures & Treatments", icon: Microscope, field: "procedures" },
//   { id: "languages", label: "Languages", icon: Languages, field: "languages" },
// ];

// // Extract YouTube video ID correctly.
// function isValidYoutube(url) {
//   if (!url) return true;

//   try {
//     const parsedUrl = new URL(String(url).trim());

//     if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
//       return false;
//     }

//     const hostname = parsedUrl.hostname
//       .toLowerCase()
//       .replace(/^www\./, '');

//     return (
//       hostname === 'youtube.com' ||
//       hostname === 'm.youtube.com' ||
//       hostname === 'youtu.be'
//     );
//   } catch {
//     return false;
//   }
// }

// function getYouTubeId(url = "") {
//   try {
//     const parsedUrl = new URL(url);

//     if (parsedUrl.hostname.includes("youtu.be")) {
//       return parsedUrl.pathname.slice(1).split("/")[0];
//     }

//     if (parsedUrl.hostname.includes("youtube.com")) {
//       if (parsedUrl.pathname === "/watch") {
//         return parsedUrl.searchParams.get("v");
//       }

//       const parts = parsedUrl.pathname.split("/");

//       if (["embed", "shorts", "live"].includes(parts[1])) {
//         return parts[2];
//       }
//     }

//     return null;
//   } catch {
//     return null;
//   }
// }

// function formatDoctorDetails(data = {}) {
//   const specialityNames = Array.isArray(data.speciality_names)
//     ? data.speciality_names
//     : typeof data.speciality_names === "string"
//       ? data.speciality_names.split(",").map((name) => name.trim()).filter(Boolean)
//       : data.speciality_name
//         ? [data.speciality_name]
//         : [];

//   const youtubeVideos = Array.isArray(data.youtube_videos)
//     ? data.youtube_videos
//     : data.youtube_url
//       ? [data.youtube_url]
//       : [];

//   const qualifications = Array.isArray(data.qualifications)
//     ? data.qualifications
//     : [];

//   const expertise = Array.isArray(data.expertise)
//     ? data.expertise
//     : [];

//   const formatVideos = youtubeVideos
//     .map((video, index) => ({
//       youtubeUrl:
//         typeof video === "string"
//           ? video
//           : video?.youtubeUrl || video?.url || video?.video_url || "",
//       title:
//         typeof video === "string"
//           ? `Health Talk ${index + 1}`
//           : video?.title || `Health Talk ${index + 1}`,
//       thumbnail:
//         typeof video === "object" && video !== null
//           ? video.thumbnail || ""
//           : "",
//     }))
//     .filter((video) => video.youtubeUrl);

//   const toList = (value) =>
//     Array.isArray(value)
//       ? value
//       : typeof value === "string" && value.trim()
//         ? [value.trim()]
//         : [];

//   return {
//     ...data,

//     specialityNames,
//     specialityIds: Array.isArray(data.speciality_ids)
//       ? data.speciality_ids
//       : [],

//     speciality: specialityNames.join(", ") || data.speciality_name || "Oncology",

//     image: mediaUrl(data.photo),
//     location: data.hospital_location || "",
//     experience: data.experience_years ?? 0,

//     qualifications,
//     education: qualifications,

//     professionalExperience: toList(data.professional_experience),
//     conferences: toList(data.conferences_workshops),
//     awards: toList(data.awards_recognition),
//     memberships: toList(data.fellowship_memberships),
//     expertise,
//     research: toList(data.research_publications),
//     procedures: toList(data.procedures_treatments),
//     languages: toList(data.languages),

//     cancerSpecialties: expertise,
//     healthTalk: formatVideos,
//   };
// }


// export default function DoctorDetailsPage() {
//   const { slug } = useParams();

//   const [patientStories, setPatientStories] = useState([]);
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // FETCH DOCTOR BY SLUG, THEN FETCH FULL DETAILS BY ID
//   useEffect(() => {
//     let isActive = true;

//     const loadDoctor = async () => {
//       try {
//         setLoading(true);
//         setDoctor(null);

//         const doctorsList = await getDoctors({ limit: 100 });

//         const selectedDoctor = doctorsList.find(
//           (item) => item.slug === slug
//         );

//         if (!selectedDoctor) {
//           if (isActive) setDoctor(null);
//           return;
//         }

//         const details = await getDoctorById(selectedDoctor.id);

//         if (isActive) {
//           setDoctor(formatDoctorDetails(details));
//         }
//       } catch (error) {
//         console.error("Failed to load doctor details:", error);

//         if (isActive) {
//           setDoctor(null);
//         }
//       } finally {
//         if (isActive) {
//           setLoading(false);
//         }
//       }
//     };

//     loadDoctor();

//     return () => {
//       isActive = false;
//     };
//   }, [slug]);

//   // FETCH PATIENT STORIES BASED ON DOCTOR SPECIALITY

//   // FETCH PATIENT STORIES BASED ON DOCTOR SPECIALITY
//   useEffect(() => {
//     let isActive = true;

//     const loadPatientStories = async () => {
//       try {
//         setPatientStories([]);

//         const stories = await getPublicStories();

//         const normalizeName = (value = "") =>
//           String(value)
//             .trim()
//             .toLowerCase()
//             .replace(/[^a-z0-9]/g, "");

//         // Doctor may have more than one speciality.
//         // const doctorSpecialityNames = (
//         //   doctor.specialityNames?.length
//         //     ? doctor.specialityNames
//         //     : [doctor.speciality_name || doctor.speciality]
//         // ).map(normalizeName).filter(Boolean);

//         const doctorSpecialityNames = (
//   doctor?.specialityNames?.length
//     ? doctor.specialityNames
//     : [doctor?.speciality_name || doctor?.speciality]
// ).map(normalizeName).filter(Boolean);

//         const doctorSpecialityIds = (
//           doctor.specialityIds || doctor.speciality_ids || []
//         ).map(Number);

//         const filteredStories = stories
//           .filter((story) => {
//             if (!story.youtubeId) return false;

//             const storySpecialityId = Number(story.speciality_id);

//             // First try matching speciality IDs.
//             const matchesById =
//               storySpecialityId > 0 &&
//               doctorSpecialityIds.includes(storySpecialityId);

//             // Fallback to speciality names.
//             const storySpecialityName = normalizeName(
//               story.specialityName || story.speciality_name
//             );

//             const matchesByName =
//               storySpecialityName &&
//               doctorSpecialityNames.includes(storySpecialityName);

//             return matchesById || matchesByName;
//           })
//           .map((story) => ({
//             id: story.id,
//             title: story.title || story.patientName || "Patient Story",
//             category: story.specialityName || "Patient Story",
//             youtubeId: story.youtubeId,
//             href:
//               story.href ||
//               story.video_url ||
//               `https://www.youtube.com/watch?v=${story.youtubeId}`,
//             thumbnail:
//               story.thumbnail ||
//               `https://img.youtube.com/vi/${story.youtubeId}/hqdefault.jpg`,
//           }));

//         if (isActive) {
//           setPatientStories(filteredStories);
//         }
//       } catch (error) {
//         console.error("Failed to load speciality patient stories:", error);

//         if (isActive) {
//           setPatientStories([]);
//         }
//       }
//     };

//     if (doctor?.id) {
//       loadPatientStories();
//     }

//     return () => {
//       isActive = false;
//     };
//   }, [doctor]);


// if (loading) {
//   return (
//     <main className="page-container min-h-[60vh] px-5 py-20 text-center">
//       <p className="text-base text-[#718075]">
//         Loading doctor profile...
//       </p>
//     </main>
//   );
// }

// if (!doctor) {
//   return (
//     <main className="page-container min-h-[60vh] px-5 py-20 text-center">
//       <h1 className="font-display text-2xl font-bold text-navy">
//         Doctor profile not found
//       </h1>

//       <Link
//         to="/doctors"
//         className="mt-5 inline-flex rounded-full bg-royal px-6 py-3 font-semibold text-white hover:bg-royaldeep"
//       >
//         Back to Doctors
//       </Link>
//     </main>
//   );
// }

// const aboutContent = doctor.about || doctor.short_bio || "";
// const safeAboutContent = DOMPurify.sanitize(aboutContent);
//   // ---------------------------------------
//   // HEALTH TALK VIDEO DATA
//   // ---------------------------------------

 
//   // HEALTH TALK VIDEOS
//   const healthTalkItems = (Array.isArray(doctor.healthTalk)
//     ? doctor.healthTalk
//     : doctor.healthTalk?.youtubeUrl
//       ? [doctor.healthTalk]
//       : []
//   )
//     .map((video) => {
//       const videoId = getYouTubeId(video.youtubeUrl);

//       if (!videoId) return null;

//       return {
//         title: video.title || "Doctor Health Talk",
//         category: doctor.speciality,
//         href: video.youtubeUrl,
//         thumbnail:
//           video.thumbnail ||
//           `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
//       };
//     })
//     .filter(Boolean);

 


//   return (
//     <main className="min-h-screen bg-[#fffdf9] text-ink">

//      {/* BREADCRUMB */}
// <nav
//   aria-label="Breadcrumb"
//   className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
//   style={{
//     backgroundImage: `url(${appointmentsWave})`,
//   }}
// >
//   <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
//     <ol className="flex flex-wrap items-center gap-2 text-base">
//       <li>
//         <Link
//           to="/"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#E87744]"
//         >
//           Home
//         </Link>
//       </li>

//       <li aria-hidden="true" className="text-white/90 drop-shadow-md">
//         /
//       </li>

//       <li>
//         <Link
//           to="/doctors"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#E87744]"
//         >
//           Doctors
//         </Link>
//       </li>

//       <li aria-hidden="true" className="text-white/90 drop-shadow-md">
//         /
//       </li>

//       <li
//         aria-current="page"
//         className="font-bold text-white drop-shadow-md"
//       >
//         {doctor.name}
//       </li>
//     </ol>
//   </div>
// </nav>

      
// {/* =========================================
//     DOCTOR PROFILE - 30% LEFT + 70% RIGHT
//     NORMAL PAGE SCROLL + STICKY LEFT
// ========================================= */}

// <section className="w-full bg-[#FFFDFA]">

//  <div className="page-container grid grid-cols-1 items-start gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:gap-8 lg:px-12 lg:py-8">

//     {/* =====================================
//         LEFT SIDE - 30% STICKY PROFILE
//     ====================================== */}

//     <aside className="w-full lg:sticky lg:top-[100px] lg:self-start">

//       <div className="rounded-xl border border-[#DCE8DC] bg-[#F1F6F0] p-4 sm:p-5 lg:p-5">

//         {/* DOCTOR IMAGE */}

//         <div className="flex justify-center">
//           <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm sm:h-32 sm:w-32 lg:h-36 lg:w-36">
//             <img
//               src={doctor.image}
//               alt={doctor.name}
//               className="h-full w-full object-cover object-top"
//             />
//           </div>
//         </div>

//         {/* DOCTOR NAME */}

//         <h1 className="mt-3 text-center font-display text-lg font-bold leading-snug text-[#304B3C] sm:text-xl lg:text-left lg:text-2xl">
//           {doctor.name}
//         </h1>

//         <p className="mt-1 text-center text-sm leading-6 text-[#647568] sm:text-base lg:text-left">
//           {doctor.designation || ""}
//         </p>

//         {/* EDUCATIONAL QUALIFICATIONS */}

//         {doctor.qualifications?.length > 0 && (
//           <div className="mt-4 border-b border-[#D5E2D5] pb-3">

//             <h2 className="font-display text-base font-bold text-[#304B3C] sm:text-lg">
//               Educational Qualifications
//             </h2>

//             <ul className="mt-2 space-y-1.5">
//               {doctor.qualifications.map((qualification, index) => (
//                 <li
//                   key={`qualification-${index}`}
//                   className="flex items-start gap-2 text-sm leading-6 text-[#414B43] sm:text-base"
//                 >
//                   <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87744]" />

//                   <span className="min-w-0 flex-1 break-words">
//                     {qualification}
//                   </span>
//                 </li>
//               ))}
//             </ul>

//           </div>
//         )}

//         {/* DOCTOR INFORMATION */}

//         <div className="mt-4 space-y-3">

//           {/* SPECIALITY */}

//           <div>
//             <p className="text-sm font-semibold text-[#476B55] sm:text-base">
//               Speciality
//             </p>

//             <p className="mt-0.5 break-words text-sm leading-6 text-[#414B43] sm:text-base">
//               {doctor.speciality || "—"}
//             </p>
//           </div>

//           {/* EXPERIENCE */}

//           <div>
//             <p className="text-sm font-semibold text-[#476B55] sm:text-base">
//               Experience
//             </p>

//             <p className="mt-0.5 text-sm leading-6 text-[#414B43] sm:text-base">
//               {doctor.experience || 0} Years
//             </p>
//           </div>

//           {/* LANGUAGES */}

//           {doctor.languages?.length > 0 && (
//             <div>
//               <p className="text-sm font-semibold text-[#476B55] sm:text-base">
//                 Languages
//               </p>

//               <ul className="mt-1 space-y-1">
//                 {doctor.languages.map((language, index) => (
//                   <li
//                     key={`language-${index}`}
//                     className="flex items-start gap-2 text-sm leading-6 text-[#414B43] sm:text-base"
//                   >
//                     <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87744]" />
//                     <span className="min-w-0 flex-1 break-words">
//                       {language}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* LOCATION */}

//           {doctor.location && (
//             <div>
//               <p className="flex items-center gap-2 text-sm font-semibold text-[#476B55] sm:text-base">
//                 <MapPin size={16} className="shrink-0" />
//                 Location
//               </p>

//               <p className="mt-0.5 break-words text-sm leading-6 text-[#414B43] sm:text-base">
//                 {doctor.location}
//               </p>
//             </div>
//           )}

//         </div>

//         {/* BOOK APPOINTMENT */}

//         <Link
//           to={`/appointments?doctor=${encodeURIComponent(doctor.name)}`}
//           className="mt-5 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#304B3C] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#476B55] sm:text-base"
//         >
//           Book An Appointment
//           <ArrowRight size={16} />
//         </Link>

//       </div>
//     </aside>


//     {/* =====================================
//         RIGHT SIDE - 70% PROFILE CONTENT
//         NORMAL PAGE SCROLL
//     ====================================== */}

//     <div className="min-w-0 lg:pr-3">

//       {/* ABOUT DOCTOR */}

//       <section className="border-b border-[#D9E0D8] pb-7 sm:pb-8">

//         <div className="flex items-center gap-3">
//           <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E2EBE1] text-[#476B55]">
//             <UserRound size={19} />
//           </span>

//           <h2 className="font-display text-xl font-bold text-[#304B3C] sm:text-2xl lg:text-3xl">
//             About the Doctor
//           </h2>
//         </div>

//         <div
//           className="mt-4 break-words text-base leading-7 text-[#414B43] sm:pl-12 sm:text-[17px] sm:leading-8 lg:text-lg
//           [&_p]:mb-4 [&_p:last-child]:mb-0
//           [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc
//           [&_ol]:mb-4 [&_ol]:ml-5 [&_ol]:list-decimal
//           [&_li]:mb-1
//           [&_strong]:font-bold [&_strong]:text-[#304B3C]
//           [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#304B3C]
//           [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#304B3C]"
//         >
//           {safeAboutContent ? (
//             <div dangerouslySetInnerHTML={{ __html: safeAboutContent }} />
//           ) : (
//             <p>Doctor profile information will be updated soon.</p>
//           )}
//         </div>

//       </section>


//       {/* OTHER DOCTOR DETAILS */}

//       {tabs
//         .filter(
//           (tab) =>
//             tab.id !== "about" &&
//             tab.id !== "education" &&
//             tab.id !== "languages"
//         )
//         .map((tab) => {
//           const Icon = tab.icon;
//           const items = tab.field ? doctor[tab.field] || [] : [];

//           if (!items.length) return null;

//           return (
//             <section
//               key={tab.id}
//               className="border-b border-[#D9E0D8] py-6 sm:py-7"
//             >

//               {/* SECTION HEADING */}

//               <div className="flex items-center gap-3">
//                 <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E2EBE1] text-[#476B55]">
//                   <Icon size={19} />
//                 </span>

//                 <h2 className="font-display text-lg font-bold text-[#304B3C] sm:text-xl lg:text-2xl">
//                   {tab.label}
//                 </h2>
//               </div>

//               {/* SEPARATE POINTS */}

//               <ul className="mt-4 space-y-3 sm:pl-12">
//                 {items.map((item, itemIndex) => (
//                   <li
//                     key={`${tab.id}-${itemIndex}`}
//                     className="flex items-start gap-3 text-base leading-7 text-[#414B43] sm:text-[17px] sm:leading-8 lg:text-lg"
//                   >
//                     <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E87744]" />

//                     <span className="min-w-0 flex-1 break-words">
//                       {item}
//                     </span>
//                   </li>
//                 ))}
//               </ul>

//             </section>
//           );
//         })}

//     </div>

//   </div>
// </section>



//       {/* ---------------------------------
//           DOCTOR HEALTH TALKS
//       ---------------------------------- */}

//       {healthTalkItems.length > 0 && (
//         <ContentVideoCarousel
//           eyebrow="WATCH & LEARN"
//           title="Doctor Health Talk"
//           subtitle={`Cancer awareness and treatment guidance from ${doctor.name}.`}
//           items={healthTalkItems}
//           slidesPerView={4}
//           autoPlay={false}
//         />
//       )}

//       {/* PATIENT STORIES BASED ON DOCTOR SPECIALITY */}
// {patientStories.length > 0 && (
//   <ContentVideoCarousel
//     eyebrow="PATIENT STORIES"
//     title={`${doctor.speciality} – Patient Testimonials`}
//     subtitle={`Patient experiences and stories related to ${doctor.speciality}.`}
//     items={patientStories}
//     slidesPerView={4}
//     autoPlay
//     interval={4500}
//     background="white"
//   />
// )}

//     </main>
//   );
// }

















// first code

// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import {
//   MapPin,
//   GraduationCap,
//   BriefcaseMedical,
//   Award,
//   BookOpen,
//   Languages,
//   ArrowRight,
//   UserRound,
//   Stethoscope,
//   Users,
//   Microscope,
//   BadgeCheck,
// } from "lucide-react";

// import { getPublicStories } from "../api/storiesApi";
// import { getDoctors, getDoctorById } from "../api/doctorsApi";
// import { mediaUrl } from "../api/specialitiesApi";
// import DOMPurify from "dompurify";

// import ContentVideoCarousel from "../components/ContentVideoCarousel";
// import appointmentsWave from "../assets/appointments-wave.jpg";

// const tabs = [
//   { id: "about", label: "About Doctor", icon: UserRound },
//   { id: "education", label: "Education & Training", icon: GraduationCap, field: "education" },
//   { id: "experience", label: "Professional Experience", icon: BriefcaseMedical, field: "professionalExperience" },
//   { id: "conferences", label: "Conferences & Workshops", icon: Users, field: "conferences" },
//   { id: "awards", label: "Awards & Recognition", icon: Award, field: "awards" },
//   { id: "membership", label: "Fellow Membership", icon: BadgeCheck, field: "memberships" },
//   { id: "expertise", label: "Areas of Expertise", icon: Stethoscope, field: "expertise" },
//   { id: "research", label: "Research & Publications", icon: BookOpen, field: "research" },
//   { id: "procedures", label: "Procedures & Treatments", icon: Microscope, field: "procedures" },
//   { id: "languages", label: "Languages", icon: Languages, field: "languages" },
// ];

// // Extract YouTube video ID correctly.
// function isValidYoutube(url) {
//   if (!url) return true;

//   try {
//     const parsedUrl = new URL(String(url).trim());

//     if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
//       return false;
//     }

//     const hostname = parsedUrl.hostname
//       .toLowerCase()
//       .replace(/^www\./, '');

//     return (
//       hostname === 'youtube.com' ||
//       hostname === 'm.youtube.com' ||
//       hostname === 'youtu.be'
//     );
//   } catch {
//     return false;
//   }
// }

// function getYouTubeId(url = "") {
//   try {
//     const parsedUrl = new URL(url);

//     if (parsedUrl.hostname.includes("youtu.be")) {
//       return parsedUrl.pathname.slice(1).split("/")[0];
//     }

//     if (parsedUrl.hostname.includes("youtube.com")) {
//       if (parsedUrl.pathname === "/watch") {
//         return parsedUrl.searchParams.get("v");
//       }

//       const parts = parsedUrl.pathname.split("/");

//       if (["embed", "shorts", "live"].includes(parts[1])) {
//         return parts[2];
//       }
//     }

//     return null;
//   } catch {
//     return null;
//   }
// }

// function formatDoctorDetails(data = {}) {
//   const specialityNames = Array.isArray(data.speciality_names)
//     ? data.speciality_names
//     : typeof data.speciality_names === "string"
//       ? data.speciality_names.split(",").map((name) => name.trim()).filter(Boolean)
//       : data.speciality_name
//         ? [data.speciality_name]
//         : [];

//   const youtubeVideos = Array.isArray(data.youtube_videos)
//     ? data.youtube_videos
//     : data.youtube_url
//       ? [data.youtube_url]
//       : [];

//   const qualifications = Array.isArray(data.qualifications)
//     ? data.qualifications
//     : [];

//   const expertise = Array.isArray(data.expertise)
//     ? data.expertise
//     : [];

//   const formatVideos = youtubeVideos
//     .map((video, index) => ({
//       youtubeUrl:
//         typeof video === "string"
//           ? video
//           : video?.youtubeUrl || video?.url || video?.video_url || "",
//       title:
//         typeof video === "string"
//           ? `Health Talk ${index + 1}`
//           : video?.title || `Health Talk ${index + 1}`,
//       thumbnail:
//         typeof video === "object" && video !== null
//           ? video.thumbnail || ""
//           : "",
//     }))
//     .filter((video) => video.youtubeUrl);

//   const toList = (value) =>
//     Array.isArray(value)
//       ? value
//       : typeof value === "string" && value.trim()
//         ? [value.trim()]
//         : [];

//   return {
//     ...data,

//     specialityNames,
//     specialityIds: Array.isArray(data.speciality_ids)
//       ? data.speciality_ids
//       : [],

//     speciality: specialityNames.join(", ") || data.speciality_name || "Oncology",

//     image: mediaUrl(data.photo),
//     location: data.hospital_location || "",
//     experience: data.experience_years ?? 0,

//     qualifications,
//     education: qualifications,

//     professionalExperience: toList(data.professional_experience),
//     conferences: toList(data.conferences_workshops),
//     awards: toList(data.awards_recognition),
//     memberships: toList(data.fellowship_memberships),
//     expertise,
//     research: toList(data.research_publications),
//     procedures: toList(data.procedures_treatments),
//     languages: toList(data.languages),

//     cancerSpecialties: expertise,
//     healthTalk: formatVideos,
//   };
// }


// export default function DoctorDetailsPage() {
//   const { slug } = useParams();

//   const [activeTab, setActiveTab] = useState("about");
//   const [patientStories, setPatientStories] = useState([]);
//   const [doctor, setDoctor] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // FETCH DOCTOR BY SLUG, THEN FETCH FULL DETAILS BY ID
//   useEffect(() => {
//     let isActive = true;

//     const loadDoctor = async () => {
//       try {
//         setLoading(true);
//         setDoctor(null);

//         const doctorsList = await getDoctors({ limit: 100 });

//         const selectedDoctor = doctorsList.find(
//           (item) => item.slug === slug
//         );

//         if (!selectedDoctor) {
//           if (isActive) setDoctor(null);
//           return;
//         }

//         const details = await getDoctorById(selectedDoctor.id);

//         if (isActive) {
//           setDoctor(formatDoctorDetails(details));
//         }
//       } catch (error) {
//         console.error("Failed to load doctor details:", error);

//         if (isActive) {
//           setDoctor(null);
//         }
//       } finally {
//         if (isActive) {
//           setLoading(false);
//         }
//       }
//     };

//     loadDoctor();

//     return () => {
//       isActive = false;
//     };
//   }, [slug]);

//   // FETCH PATIENT STORIES BASED ON DOCTOR SPECIALITY

//   // FETCH PATIENT STORIES BASED ON DOCTOR SPECIALITY
//   useEffect(() => {
//     let isActive = true;

//     const loadPatientStories = async () => {
//       try {
//         setPatientStories([]);

//         const stories = await getPublicStories();

//         const normalizeName = (value = "") =>
//           String(value)
//             .trim()
//             .toLowerCase()
//             .replace(/[^a-z0-9]/g, "");

//         // Doctor may have more than one speciality.
//         const doctorSpecialityNames = (
//           doctor.specialityNames?.length
//             ? doctor.specialityNames
//             : [doctor.speciality_name || doctor.speciality]
//         ).map(normalizeName).filter(Boolean);

//         const doctorSpecialityIds = (
//           doctor.specialityIds || doctor.speciality_ids || []
//         ).map(Number);

//         const filteredStories = stories
//           .filter((story) => {
//             if (!story.youtubeId) return false;

//             const storySpecialityId = Number(story.speciality_id);

//             // First try matching speciality IDs.
//             const matchesById =
//               storySpecialityId > 0 &&
//               doctorSpecialityIds.includes(storySpecialityId);

//             // Fallback to speciality names.
//             const storySpecialityName = normalizeName(
//               story.specialityName || story.speciality_name
//             );

//             const matchesByName =
//               storySpecialityName &&
//               doctorSpecialityNames.includes(storySpecialityName);

//             return matchesById || matchesByName;
//           })
//           .map((story) => ({
//             id: story.id,
//             title: story.title || story.patientName || "Patient Story",
//             category: story.specialityName || "Patient Story",
//             youtubeId: story.youtubeId,
//             href:
//               story.href ||
//               story.video_url ||
//               `https://www.youtube.com/watch?v=${story.youtubeId}`,
//             thumbnail:
//               story.thumbnail ||
//               `https://img.youtube.com/vi/${story.youtubeId}/hqdefault.jpg`,
//           }));

//         if (isActive) {
//           setPatientStories(filteredStories);
//         }
//       } catch (error) {
//         console.error("Failed to load speciality patient stories:", error);

//         if (isActive) {
//           setPatientStories([]);
//         }
//       }
//     };

//     if (doctor?.id) {
//       loadPatientStories();
//     }

//     return () => {
//       isActive = false;
//     };
//   }, [doctor]);


// if (loading) {
//   return (
//     <main className="page-container min-h-[60vh] px-5 py-20 text-center">
//       <p className="text-base text-[#718075]">
//         Loading doctor profile...
//       </p>
//     </main>
//   );
// }

// if (!doctor) {
//   return (
//     <main className="page-container min-h-[60vh] px-5 py-20 text-center">
//       <h1 className="font-display text-2xl font-bold text-navy">
//         Doctor profile not found
//       </h1>

//       <Link
//         to="/doctors"
//         className="mt-5 inline-flex rounded-full bg-royal px-6 py-3 font-semibold text-white hover:bg-royaldeep"
//       >
//         Back to Doctors
//       </Link>
//     </main>
//   );
// }

//   const active = tabs.find((tab) => tab.id === activeTab) || tabs[0];

//   const ActiveIcon = active.icon;

//   const list = active.field ? doctor[active.field] || [] : [];

// const aboutContent = doctor.about || doctor.short_bio || "";
// const safeAboutContent = DOMPurify.sanitize(aboutContent);
//   // ---------------------------------------
//   // HEALTH TALK VIDEO DATA
//   // ---------------------------------------

 
//   // HEALTH TALK VIDEOS
//   const healthTalkItems = (Array.isArray(doctor.healthTalk)
//     ? doctor.healthTalk
//     : doctor.healthTalk?.youtubeUrl
//       ? [doctor.healthTalk]
//       : []
//   )
//     .map((video) => {
//       const videoId = getYouTubeId(video.youtubeUrl);

//       if (!videoId) return null;

//       return {
//         title: video.title || "Doctor Health Talk",
//         category: doctor.speciality,
//         href: video.youtubeUrl,
//         thumbnail:
//           video.thumbnail ||
//           `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
//       };
//     })
//     .filter(Boolean);

 


//   return (
//     <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-ink">

//      {/* BREADCRUMB */}
// <nav
//   aria-label="Breadcrumb"
//   className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
//   style={{
//     backgroundImage: `url(${appointmentsWave})`,
//   }}
// >
//   <div className="page-container relative z-10 mx-auto px-5 py-3 sm:px-8 lg:px-12">
//     <ol className="flex flex-wrap items-center gap-2 text-base">
//       <li>
//         <Link
//           to="/"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#E87744]"
//         >
//           Home
//         </Link>
//       </li>

//       <li aria-hidden="true" className="text-white/90 drop-shadow-md">
//         /
//       </li>

//       <li>
//         <Link
//           to="/doctors"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#E87744]"
//         >
//           Doctors
//         </Link>
//       </li>

//       <li aria-hidden="true" className="text-white/90 drop-shadow-md">
//         /
//       </li>

//       <li
//         aria-current="page"
//         className="font-bold text-white drop-shadow-md"
//       >
//         {doctor.name}
//       </li>
//     </ol>
//   </div>
// </nav>

//       {/* DOCTOR HERO SECTION - ORIGINAL DESIGN */}
//       <section className="bg-ice">

//         <div className="page-container grid items-center gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-10 lg:px-12 lg:py-8">

//           {/* DOCTOR IMAGE */}
//           <div className="flex h-[320px] items-end justify-center overflow-hidden sm:h-[380px] lg:h-[430px]">
//           {/* <div className="flex h-[270px] items-end justify-center overflow-hidden sm:h-[320px] lg:h-[340px]"> */}

//             <img
//               src={doctor.image}
//               alt={doctor.name}
//               className="h-full w-full object-contain object-bottom"
//             />

//           </div>

//           {/* DOCTOR INFORMATION */}
//           <div className="py-2 lg:py-5">

//             <span className="text-sm font-bold tracking-[0.18em] text-sky">
//               KIMS RENOVA SPECIALIST
//             </span>

//             <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-navy sm:text-4xl">
//               {doctor.name}
//             </h1>

//             <p className="mt-3 text-lg font-semibold text-royal">
//               {doctor.designation}
//             </p>

//             <p className="mt-2 text-base leading-7 text-[#526357]">
//               {(doctor.qualifications || []).join(", ")}
//             </p>

//             <div className="mt-5 flex flex-col gap-3">

//               <div>
//                 <h2 className="text-lg font-bold text-navy">
//                   Speciality
//                 </h2>

//                 <p className="mt-1 text-base text-[#405247]">
//                   {doctor.speciality}
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-lg font-bold text-navy">
//                   Location
//                 </h2>

//                 <p className="mt-1 flex items-start gap-2 text-base text-[#405247]">
//                   <MapPin
//                     size={18}
//                     className="mt-1 shrink-0 text-royal"
//                   />

//                   {doctor.location}
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-lg font-bold text-navy">
//                   Experience
//                 </h2>

//                 <p className="mt-1 text-base text-[#405247]">
//                   {doctor.experience}+ Years
//                 </p>
//               </div>

//             </div>

//             {/* ACTION BUTTONS */}
//             <div className="mt-6 flex flex-wrap gap-3">

//               <Link
//                 to={`/appointments?doctor=${encodeURIComponent(doctor.name)}`}
//                 className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-royal px-6 py-3 text-base font-bold text-white transition hover:bg-royaldeep"
//               >
//                 Book Appointment
//                 <ArrowRight size={17} />
//               </Link>

//               <Link
//                 to="/doctors"
//                 className="inline-flex min-h-11 items-center justify-center rounded-full border border-royal px-6 py-3 text-base font-bold text-royal transition hover:bg-white"
//               >
//                 All Doctors
//               </Link>

//             </div>
//           </div>
//         </div>
//       </section>

//       {/* DOCTOR DETAILS AND TABS - ORIGINAL DESIGN */}
//       <section className="page-container grid gap-7 px-5 py-9 sm:px-8 lg:grid-cols-[290px_1fr] lg:gap-8 lg:px-12 lg:py-12">

//         {/* LEFT SIDE TABS */}
//         <aside
//           aria-label="Doctor profile sections"
//           className="flex gap-1 overflow-x-auto border-b border-line pb-1 lg:flex-col lg:self-start lg:overflow-visible lg:border-b-0 lg:border-r lg:pb-0 lg:pr-4"
//         >

//           {tabs.map((tab) => {
//             const Icon = tab.icon;

//             const selected = activeTab === tab.id;

//             return (
//               <button
//                 key={tab.id}
//                 type="button"
//                 onClick={() => setActiveTab(tab.id)}
//                 aria-current={selected ? "page" : undefined}
//                 className={`flex shrink-0 items-center gap-3 whitespace-nowrap border-b-[3px] px-3 py-3 text-left text-sm transition sm:text-base lg:w-full lg:border-b-0 lg:border-l-4 lg:py-3 ${
//                   selected
//                     ? "border-sky bg-ice font-bold text-navy lg:border-royal"
//                     : "border-transparent text-[#405247] hover:bg-mist hover:text-royal"
//                 }`}
//               >

//                 <Icon
//                   size={19}
//                   className="shrink-0 text-royal"
//                 />

//                 <span>{tab.label}</span>

//               </button>
//             );
//           })}

//         </aside>

//         {/* RIGHT SIDE CONTENT */}
//         <div
//           key={activeTab}
//           className="min-h-[300px] animate-[fade-up_.3s_ease_both] px-1 py-1 sm:px-3"
//         >

//           <div className="flex items-center gap-3">

//             <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ice text-royal">
//               <ActiveIcon size={22} />
//             </span>

//             <h2 className="font-display text-xl font-bold text-navy sm:text-2xl">
//               {active.label}
//             </h2>

//           </div>

//           {/* ABOUT DOCTOR */}
         
// {activeTab === "about" ? (

//   <div className="mt-5 space-y-5 text-base leading-8 text-[#526357]">

//     {safeAboutContent ? (
//       <div
//         className="text-base leading-8 text-[#526357] [&_p]:mb-3 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:ml-6 [&_ol]:list-decimal [&_strong]:font-bold [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_h3]:mb-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-navy"
//         dangerouslySetInnerHTML={{ __html: safeAboutContent }}
//       />
//     ) : (
//       <p>Doctor profile information will be updated soon.</p>
//     )}

//     {doctor.cancerSpecialties?.length > 0 && (
//       <div>
//         <h3 className="font-display text-lg font-bold text-navy">
//           Areas of Expertise
//         </h3>

//         <ul className="mt-2 ml-5 list-disc space-y-1">
//           {doctor.cancerSpecialties.map((item, index) => (
//             <li key={index}>{item}</li>
//           ))}
//         </ul>
//       </div>
//     )}

//   </div>

// ) : list.length ? (

//             /* OTHER DETAILS */
//             <ul className="mt-5 divide-y divide-[#edf1ed]">

//               {list.map((item, index) => (

//                 <li
//                   key={`${activeTab}-${index}`}
//                   className="flex items-start gap-3 py-3 text-base leading-7 text-[#526357]"
//                 >

//                   <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-sky" />

//                   {item}

//                 </li>

//               ))}

//             </ul>

//           ) : (

//             <p className="mt-5 text-base text-[#718075]">
//               Details will be updated soon.
//             </p>

//           )}

//         </div>
//       </section>

//       {/* ---------------------------------
//           DOCTOR HEALTH TALKS
//       ---------------------------------- */}

//       {healthTalkItems.length > 0 && (
//         <ContentVideoCarousel
//           eyebrow="WATCH & LEARN"
//           title="Doctor Health Talk"
//           subtitle={`Cancer awareness and treatment guidance from ${doctor.name}.`}
//           items={healthTalkItems}
//           slidesPerView={4}
//           autoPlay={false}
//         />
//       )}

//       {/* PATIENT STORIES BASED ON DOCTOR SPECIALITY */}
// {patientStories.length > 0 && (
//   <ContentVideoCarousel
//     eyebrow="PATIENT STORIES"
//     title={`${doctor.speciality} – Patient Testimonials`}
//     subtitle={`Patient experiences and stories related to ${doctor.speciality}.`}
//     items={patientStories}
//     slidesPerView={4}
//     autoPlay
//     interval={4500}
//     background="white"
//   />
// )}

//     </main>
//   );
// }




