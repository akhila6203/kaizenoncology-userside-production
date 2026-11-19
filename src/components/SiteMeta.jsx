
import { useEffect } from "react";
import { getSettingsApi } from "../api/settingsApi";

export default function SiteMeta() {
  useEffect(() => {
    const loadSeoSettings = async () => {
      try {
        const response = await getSettingsApi();

        const settings =
          response?.data?.data ||
          response?.data ||
          {};

        // META DESCRIPTION
        let descriptionTag = document.querySelector(
          'meta[name="description"]'
        );

        if (!descriptionTag) {
          descriptionTag = document.createElement("meta");
          descriptionTag.setAttribute("name", "description");
          document.head.appendChild(descriptionTag);
        }

        descriptionTag.setAttribute(
          "content",
          settings.meta_description || ""
        );

        // META KEYWORDS
        let keywordsTag = document.querySelector(
          'meta[name="keywords"]'
        );

        if (settings.meta_keywords?.trim()) {
          if (!keywordsTag) {
            keywordsTag = document.createElement("meta");
            keywordsTag.setAttribute("name", "keywords");
            document.head.appendChild(keywordsTag);
          }

          keywordsTag.setAttribute(
            "content",
            settings.meta_keywords
          );
        } else if (keywordsTag) {
          keywordsTag.remove();
        }

      } catch (error) {
        console.error("SEO settings loading error:", error);
      }
    };

    loadSeoSettings();
  }, []);

  return null;
}
