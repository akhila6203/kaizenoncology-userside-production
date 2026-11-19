
import axiosClient from "./axiosClient";
import { mediaUrl } from "./specialitiesApi";

// Convert backend comma-separated values or arrays into an array.
const toArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

// Convert backend doctor record into the format used by website pages.
export const formatDoctor = (doctor = {}) => {
  const specialityNames = toArray(
    doctor.speciality_names || doctor.speciality_name
  );

  const youtubeVideos = Array.isArray(doctor.youtube_videos)
    ? doctor.youtube_videos
    : doctor.youtube_url
      ? [doctor.youtube_url]
      : [];

  const qualifications = toArray(doctor.qualifications);

  const expertise = toArray(doctor.expertise);

  const toVideo = (video, index) => {
    if (typeof video === "string") {
      return {
        youtubeUrl: video,
        title: `Health Talk ${index + 1}`,
        thumbnail: "",
      };
    }

    return {
      youtubeUrl: video?.youtubeUrl || video?.url || video?.video_url || "",
      title: video?.title || `Health Talk ${index + 1}`,
      thumbnail: video?.thumbnail || "",
    };
  };

  return {
    ...doctor,

    // Common display fields
    specialityNames,
    speciality: specialityNames.join(", ") || "Oncology",
    location: doctor.hospital_location || "",
    experience: doctor.experience_years ?? 0,
    image: mediaUrl(doctor.photo),

    // Profile fields
    qualifications,
    education: qualifications,
    expertise,
    cancerSpecialties: expertise,

    professionalExperience: toArray(doctor.professional_experience),
    conferences: toArray(doctor.conferences_workshops),
    awards: toArray(doctor.awards_recognition),
    memberships: toArray(doctor.fellowship_memberships),
    research: toArray(doctor.research_publications),
    procedures: toArray(doctor.procedures_treatments),
    languages: toArray(doctor.languages),

    // Videos saved in doctor_profile_items.youtube_videos
    healthTalk: youtubeVideos.map(toVideo).filter((video) => video.youtubeUrl),
  };
};

// GET ALL ACTIVE DOCTORS
export const getDoctors = async (params = {}) => {
  const response = await axiosClient.get("/doctors", {
    params: {
      is_active: 1,
      limit: 100,
      ...params,
    },
  });

  const result = response.data;

  const rows = Array.isArray(result?.rows)
    ? result.rows
    : Array.isArray(result?.data)
      ? result.data
      : [];

  return rows.map(formatDoctor);
};

// GET ONE DOCTOR WITH FULL PROFILE DETAILS
export const getDoctorById = async (id) => {
  const response = await axiosClient.get(`/doctors/${id}`);

  const result = response.data?.data ?? response.data;

  return formatDoctor(result);
};







