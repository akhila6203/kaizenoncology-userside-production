
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
    ariaLabel="Educational videos"
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










