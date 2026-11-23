import axiosClient from "./axiosClient";

// Fetch active homepage slider slides
export const getPublicSlides = () => {
  return axiosClient.get("/home-sliders/public");
};