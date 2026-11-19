
import axiosClient from "./axiosClient";

/* =========================================
   GET ALL ACTIVE SPECIALITIES
========================================= */
export const getSpecialities = async (params = {}) => {
  const response = await axiosClient.get("/specialities", {
    params: {
      is_active: 1,
      limit: 100,
      ...params,
    },
  });

  const result = response.data?.data ?? response.data;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.rows)) return result.rows;
  if (Array.isArray(result?.specialities)) return result.specialities;

  return [];
};

/* =========================================
   GET SINGLE SPECIALITY BY SLUG
========================================= */
export const getSpecialityBySlug = async (slug) => {
  const response = await axiosClient.get(
    `/specialities/slug/${slug}`
  );

  const result = response.data?.data ?? response.data;

  return result?.speciality ?? result?.row ?? result;
};


// Convert backend image path into a full image URL
// const API_ORIGIN = (axiosClient.defaults.baseURL || "")
//   .replace(/\/api\/?$/, "")
//   .replace(/\/+$/, "");
  const API_ORIGIN = (axiosClient.defaults.baseURL || "")
  .trim()
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

export const mediaUrl = (path) => {
  if (!path) return "";

  const imagePath = String(path).trim();

  // Already a complete URL
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  // Convert relative backend path into full URL
  return `${API_ORIGIN}/${imagePath.replace(/^\/+/, "")}`;
};








