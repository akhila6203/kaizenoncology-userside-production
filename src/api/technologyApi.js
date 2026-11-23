import axiosClient from "./axiosClient";

// Convert backend image path to full image URL
export const getTechnologyImage = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const baseURL = axiosClient.defaults.baseURL || "";
  const origin = baseURL.replace(/\/api\/?$/, "");

  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

// Get all published technologies
export const getTechnologies = async () => {
  const res = await axiosClient.get("/technology-details/public");

  if (!res.data?.success || !Array.isArray(res.data?.data)) {
    console.error("Invalid technologies API response:", res.data);
    return [];
  }

  return res.data.data;
};

// Get technology details using slug
export const getTechnologyDetails = async (slug) => {
  const res = await axiosClient.get(
    `/public/technologies/${slug}/details`
  );

  return res.data?.data || null;
};