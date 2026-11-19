
import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

const getYouTubeVideoId = (value = "") => {
  if (!value) return "";

  const input = String(value).trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (
      ["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)
    ) {
      return (
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1] ||
        ""
      );
    }
  } catch {
    return "";
  }

  return "";
};

export default function VideoPlayerModal({ video, onClose }) {
  const playerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoId = getYouTubeVideoId(
    video?.youtubeId || video?.video_url || video?.href
  );

  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (event) => {
      // If browser fullscreen is active, first Escape exits fullscreen.
      // A second Escape closes the popup.
      if (event.key === "Escape" && !document.fullscreenElement) {
        onClose();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.body.style.overflow = "";
    };
  }, [video, onClose]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await playerRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Unable to toggle fullscreen:", error);
    }
  };

  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={playerRef}
        className="relative w-full max-w-5xl overflow-hidden rounded-xl bg-black shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={video.title || "Video player"}
      >
        <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Full screen"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-[#E87744]"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            title="Close video"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-[#E87744]"
          >
            <X size={22} />
          </button>
        </div>

        {videoId ? (
          <div className="aspect-video w-full">
            <iframe
              key={videoId}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={video.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center text-white">
            Video is not available.
          </div>
        )}
      </div>
    </div>
  );
}
