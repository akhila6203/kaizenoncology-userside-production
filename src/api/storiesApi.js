
import axiosClient from "./axiosClient";

// Extract YouTube ID from a full URL or an existing video ID
const getYouTubeVideoId = (value = "") => {
  if (!value) return "";

  const input = String(value).trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      return (
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] ||
        ""
      );
    }

    return "";
  } catch {
    return "";
  }
};

export const getPublicStories = async () => {
  const response = await axiosClient.get("/public/our-stories");
  const result = response.data;

  // Your backend returns: { success: true, rows: [...], total, page, limit }
  const stories =
    Array.isArray(result?.rows) ? result.rows :
    Array.isArray(result?.data?.rows) ? result.data.rows :
    Array.isArray(result?.data) ? result.data :
    Array.isArray(result?.items) ? result.items :
    Array.isArray(result?.stories) ? result.stories :
    Array.isArray(result) ? result :
    [];

  // Convert backend fields into the format used by the frontend
  return stories
    .map((story) => {
      const videoUrl = story.video_url || story.youtube_url || "";
      const youtubeId = getYouTubeVideoId(videoUrl);

      if (!youtubeId) return null;

      return {
        ...story,
        id: story.id,
        title: story.title || story.patient_name || "Patient Story",
        patientName: story.patient_name || "",
        specialityName: story.speciality_name || "",
        category: story.speciality_name || "",
        video_url: videoUrl,
        youtubeId,
        href: videoUrl,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
      };
    })
    .filter(Boolean);
};



