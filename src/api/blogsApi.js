
import axiosClient from "./axiosClient";

// Backend server origin from axios baseURL
const origin = (axiosClient.defaults.baseURL || "")
  .replace(/\/api\/?$/, "")
  .replace(/\/+$/, "");

// Convert backend image path into full image URL
export function blogImageUrl(path) {
  if (!path) return "";

  const imagePath = String(path).trim();

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  return `${origin}/${imagePath.replace(/^\/+/, "")}`;
}

// Convert HTML content into plain text
function textFromHtml(html) {
  return String(html || "")
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|div|h[1-6]|li)>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Create a URL-friendly slug
function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Convert backend blog response into frontend blog format
export function mapBlogItem(row) {
  if (!row) return null;

  // Use short description for cards; fall back to article content
  const raw = textFromHtml(
    row.short_description || row.content
  );

  const words = raw.split(/\s+/).filter(Boolean).length;
  const dateValue = row.published_at || row.created_at;
  const createdAt = row.created_at || null;

  // Prefer speciality name returned by backend JOIN
  const category =
    row.category ||
    row.speciality_name ||
    "Healthcare";

  return {
    id: row.id,
    slug: row.slug || String(row.id),

    title: row.title || "",
    author: row.author_name || "",

    category,
    categorySlug: createSlug(category),

    // Speciality information from backend
    specialityId: row.speciality_id || null,
    specialityName: row.speciality_name || "",
    specialitySlug: createSlug(
      row.speciality_name || ""
    ),

    image: blogImageUrl(row.thumbnail),

    excerpt:
      raw.length > 175
        ? `${raw.slice(0, 172)}...`
        : raw,

    content: row.content || "",

    date: dateValue
  ? new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "",

// Actual article creation date and time
createdAt,

readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
  };
}

// Get all published blogs
export async function getBlogs({
  search = "",
  speciality_id = "",
  page = 1,
  limit = 100,
} = {}) {
  const response = await axiosClient.get("/public/blogs", {
    params: {
      page,
      limit,
      search,
      speciality_id,
    },
  });

  const rows =
    response.data?.rows ||
    response.data?.data?.rows ||
    [];

  return rows.map(mapBlogItem).filter(Boolean);
}

// Get one published blog by slug
export async function getBlogBySlug(slug) {
  const response = await axiosClient.get(
    `/public/blogs/${encodeURIComponent(slug)}`
  );

  const row =
    response.data?.data?.blog ||
    response.data?.data;

  return mapBlogItem(row);
}
