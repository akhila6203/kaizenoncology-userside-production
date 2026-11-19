import axiosClient from "./axiosClient";

export const healthLibraryApi = {
  // Public website form submission
  submit: (formData) =>
    axiosClient.post("/health-library/submit", formData),

  // Admin APIs
  list: (params) =>
    axiosClient.get("/health-library", { params }),

  get: (id) =>
    axiosClient.get(`/health-library/${id}`),

  create: (formData) =>
    axiosClient.post("/health-library", formData),

  update: (id, formData) =>
    axiosClient.put(`/health-library/${id}`, formData),

  remove: (id) =>
    axiosClient.delete(`/health-library/${id}`),
};