
import axiosClient from "./axiosClient";

/* =========================================
   GET PUBLISHED FAQs
   Supports:
   - All FAQs
   - Page-specific FAQs
   - Speciality-specific FAQs
========================================= */

export const getPublishedFaqs = async (params = {}) => {
  const allFaqs = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const response = await axiosClient.get("/faqs", {
      params: {
        page,
        limit,
        ...params,
      },
    });

    const result = response.data;

    if (result?.success === false) {
      throw new Error(
        result.message || "Unable to load FAQs"
      );
    }

    const rows = Array.isArray(result?.rows)
      ? result.rows
      : [];

    allFaqs.push(...rows);

    const total = Number(result?.total ?? 0);

    if (
      rows.length === 0 ||
      allFaqs.length >= total
    ) {
      break;
    }

    page += 1;
  }

  // Only return published FAQs with valid questions and answers
  return allFaqs
    .filter(
      (faq) =>
        Number(faq.is_published) === 1 &&
        faq.question?.trim() &&
        faq.answer?.trim()
    )
    .map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      speciality_id: faq.speciality_id,
      speciality_name: faq.speciality_name,
      is_other: Number(faq.is_other) === 1,
      display_pages: faq.display_pages || "",
    }));
};

/* =========================================
   GET PAGE-SPECIFIC FAQs
   Example: home, about-us, services
========================================= */

export const getPageFaqs = async (pageName) => {
  if (!pageName) return [];

  return getPublishedFaqs({
    display_page: pageName,
  });
};

/* =========================================
   GET SPECIALITY-SPECIFIC FAQs
   Example: specialityId = 12
========================================= */

export const getSpecialityFaqs = async (specialityId) => {
  if (!specialityId) return [];

  return getPublishedFaqs({
    speciality_id: specialityId,
  });
};






