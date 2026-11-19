
import { useEffect, useState } from "react";

import ContentVideoCarousel from "./ContentVideoCarousel";
import { getPublicStories } from "../api/storiesApi";

export default function VideoSlider() {
  const [videoItems, setVideoItems] = useState([]);

  useEffect(() => {
    let active = true;

    const loadStories = async () => {
      try {
        const stories = await getPublicStories();

        if (active) {
          setVideoItems(stories);
        }
      } catch (error) {
        console.error("Unable to load patient stories:", error);
      }
    };

    loadStories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <ContentVideoCarousel
      eyebrow="LEARN & UNDERSTAND"
      title="Education can make every question count."
      subtitle="Watch educational videos about breast awareness, cancer diagnosis, treatment options and patient care."
      items={videoItems}
      slidesPerView={4}
      autoPlay={true}
      interval={4500}
      background="mist"
    />
  );
}















// import ContentVideoCarousel from "./ContentVideoCarousel";
// import { healthVideos } from "../data/healthLibraryData";

// // Extract YouTube video ID from a full URL or plain ID
// const getYouTubeVideoId = (value) => {
//   if (!value) return "";

//   if (/^[a-zA-Z0-9_-]{11}$/.test(value)) {
//     return value;
//   }

//   try {
//     const url = new URL(value);

//     if (url.hostname.includes("youtu.be")) {
//       return url.pathname.split("/").filter(Boolean)[0] || "";
//     }

//     if (url.pathname.includes("/shorts/")) {
//       return url.pathname.split("/shorts/")[1]?.split("/")[0] || "";
//     }

//     if (url.pathname.includes("/embed/")) {
//       return url.pathname.split("/embed/")[1]?.split("/")[0] || "";
//     }

//     return url.searchParams.get("v") || "";
//   } catch {
//     return "";
//   }
// };

// export default function VideoSlider() {
//   const videoItems = healthVideos.map((video, index) => {
//     const videoId = getYouTubeVideoId(video.youtubeId);

//     return {
//       id: video.id || index + 1,
//       title: video.title,
//       category: video.category || "Cancer Awareness",
//       description: video.description || "",
//       thumbnail: videoId
//         ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
//         : "",
//       href: videoId
//         ? `https://www.youtube.com/watch?v=${videoId}`
//         : "",
//     };
//   });

//   return (
//     <ContentVideoCarousel
//       eyebrow="LEARN & UNDERSTAND"
//       title="Education can make every question count."
//       subtitle="Watch educational videos about breast awareness, cancer diagnosis, treatment options and patient care."
//       items={videoItems}
//       slidesPerView={4}
//       autoPlay={true}
//       interval={4500}
//       background="mist"
//     />
//   );
// }

