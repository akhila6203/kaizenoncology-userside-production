// src/pages/ServiceContentUtils.js

// HTML content ni plain text ga convert cheyadaniki
export const cleanText = (value) => {
  if (value == null) return "";

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value !== "string") return "";

  return value
    // <br> tags -> new line
    .replace(/<\s*br\s*\/?>/gi, "\n")

    // Paragraph endings -> new line
    .replace(/<\s*\/p\s*>/gi, "\n\n")

    // Remaining HTML tags remove
    .replace(/<[^>]*>/g, " ")

    // HTML entities convert
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")

    // Spaces cleanup
    .replace(/[ \t]+/g, " ")
    .trim();
};


// Convert array or string to text array
export const asTextList = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean);
  }

  if (typeof value === "string") {
    const cleaned = cleanText(value);

    return cleaned
      ? cleaned.split(/\n+/).map((line) => line.trim()).filter(Boolean)
      : [];
  }

  return [];
};


// Get content sections
export const getServiceContentSections = (content = {}) => {
  const raw =
    content.sections ||
    content.content_sections ||
    content.detail_sections ||
    content.blocks ||
    content.details ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw
    .filter((section) => section && typeof section === "object")
    .map((section) => ({
      title: cleanText(section.title || section.heading || section.name),

      text: asTextList(
        section.paragraphs ||
          section.description ||
          section.body ||
          section.content ||
          section.text
      ),

      bullets: asTextList(
        section.bullets || section.list || section.items
      ),

      image:
        section.image ||
        section.image_path ||
        section.photo ||
        "",
    }))
    .filter(
      (section) =>
        section.title ||
        section.text.length ||
        section.bullets.length ||
        section.image
    );
};


// Get main intro paragraphs
export const getServiceContentParagraphs = (content = {}) => {
  const candidates = [
    content.overview,
    content.introduction,
    content.long_description,
    content.description,
    content.body,
    content.content,
    content.paragraphs,
  ];

  for (const candidate of candidates) {
    const paragraphs = asTextList(candidate);

    if (paragraphs.length) {
      return paragraphs;
    }
  }

  return [];
};