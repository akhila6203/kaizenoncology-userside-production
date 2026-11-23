
import { useCallback, useEffect, useState } from "react";
import axiosClient from "./axiosClient";

/* =========================================================
   API ORIGIN
========================================================= */

const API_ORIGIN = String(
  axiosClient.defaults.baseURL || "http://localhost:5000"
)
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

/* =========================================================
   MEDIA URL
========================================================= */

export const mediaUrl = (path) => {
  if (!path) return "";

  const value = String(path).trim();

  if (
    /^https?:\/\//i.test(value) ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
};

/* =========================================================
   SLUGIFY
========================================================= */

export const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* =========================================================
   RESPONSE HELPER
========================================================= */

const unwrap = (response) =>
  response?.data?.data ?? response?.data ?? [];

/* =========================================================
   PUBLIC SERVICES API
========================================================= */

export const fetchServices = async () => {
  const response = await axiosClient.get("/public/services");

  const data = unwrap(response);

  return Array.isArray(data)
    ? data
    : data?.rows || data?.services || [];
};

/* =========================================================
   SERVICE SLUG FALLBACKS
========================================================= */

const serviceSlugFallbacks = (slug) => {
  if (slug === "cancer-types") return ["cancer"];
  if (slug === "cancer") return ["cancer-types"];

  return [];
};

/* =========================================================
   FETCH SINGLE SERVICE
========================================================= */

export const fetchService = async (slug) => {
  try {
    const response = await axiosClient.get(
      `/public/services/${encodeURIComponent(slug)}`
    );

    return unwrap(response);
  } catch (error) {
    for (const fallbackSlug of serviceSlugFallbacks(slug)) {
      try {
        const response = await axiosClient.get(
          `/public/services/${encodeURIComponent(fallbackSlug)}`
        );

        return unwrap(response);
      } catch {
        // Try next compatibility slug
      }
    }

    throw error;
  }
};

/* =========================================================
   FETCH SERVICE PAGES / CARDS
========================================================= */

export const fetchPages = async (slug) => {
  const slugs = [slug, ...serviceSlugFallbacks(slug)];

  let lastError;
  let emptyResult = [];

  for (const candidate of slugs) {
    try {
      const response = await axiosClient.get(
        `/public/services/${encodeURIComponent(candidate)}/pages`
      );

      const data = unwrap(response);

      const pages = Array.isArray(data)
        ? data
        : data?.rows || data?.pages || [];

      if (pages.length) {
        return pages;
      }

      emptyResult = pages;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError && !emptyResult.length) {
    throw lastError;
  }

  return emptyResult;
};

/* =========================================================
   FETCH SINGLE SERVICE PAGE DETAIL
========================================================= */

export const fetchPage = async (serviceSlug, pageSlug) => {
  const response = await axiosClient.get(
    `/public/services/${encodeURIComponent(serviceSlug)}/pages/${encodeURIComponent(pageSlug)}`
  );

  return unwrap(response);
};

/* =========================================================
   PUBLIC API ALIASES
   Compatibility with other components
========================================================= */

export const getPublicServices = () => fetchServices();

export const getPublicService = (slug) => fetchService(slug);

export const getPublicServicePages = (slug) => fetchPages(slug);

export const getPublicServicePage = (serviceSlug, pageSlug) =>
  fetchPage(serviceSlug, pageSlug);

/* =========================================================
   ADMIN SERVICE CONTENT API
========================================================= */

export const serviceContentApi = {
  upload: (file) => {
    const fd = new FormData();
    fd.append("image", file);

    return axiosClient.post("/service-content/upload", fd);
  },

  // Service types
  listServices: () =>
    axiosClient.get("/service-content/services"),

  getService: (id) =>
    axiosClient.get(`/service-content/services/${id}`),

  createService: (payload) =>
    axiosClient.post("/service-content/services", payload),

  updateService: (id, payload) =>
    axiosClient.put(`/service-content/services/${id}`, payload),

  deleteService: (id) =>
    axiosClient.delete(`/service-content/services/${id}`),

  // Service pages / cards
  listPages: () =>
    axiosClient.get("/service-content/pages"),

  getPage: (id) =>
    axiosClient.get(`/service-content/pages/${id}`),

  createPage: (payload) =>
    axiosClient.post("/service-content/pages", payload),

  updatePage: (id, payload) =>
    axiosClient.put(`/service-content/pages/${id}`, payload),

  deletePage: (id) =>
    axiosClient.delete(`/service-content/pages/${id}`),
};

export default serviceContentApi;

/* =========================================================
   SERVICES CACHE
   Header menu refreshes after 30 seconds
========================================================= */

let servicesCache = null;
let servicesCacheAt = 0;

const CACHE_TTL = 30000;

/* =========================================================
   HOOK: SERVICES
   Used by Header dropdown
========================================================= */

export function useServices() {
  const [services, setServices] = useState(servicesCache || []);

  const [loading, setLoading] = useState(
    !servicesCache || Date.now() - servicesCacheAt > CACHE_TTL
  );

  useEffect(() => {
    if (
      servicesCache &&
      Date.now() - servicesCacheAt < CACHE_TTL
    ) {
      setServices(servicesCache);
      setLoading(false);
      return;
    }

    let alive = true;

    fetchServices()
      .then((list) => {
        servicesCache = list;
        servicesCacheAt = Date.now();

        if (alive) {
          setServices(list);
        }
      })
      .catch((error) => {
        console.error("Public services API error:", error);

        if (alive) {
          setServices([]);
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  return {
    services,
    loading,
  };
}

/* =========================================================
   HOOK: SERVICES WITH FULL CONTENT
   Used by Services Hub / listing page
========================================================= */

export function useServicesWithContent() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setError(false);

    fetchServices()
      .then((list) =>
        Promise.all(
          list.map((service) =>
            fetchService(service.slug).catch(() => service)
          )
        )
      )
      .then((full) => {
        if (alive) {
          setServices(full);
        }
      })
      .catch((err) => {
        console.error("Services hub API error:", err);

        if (alive) {
          setServices([]);
          setError(true);
        }
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
        }
      });

    return () => {
      alive = false;
    };
  }, []);

  return {
    services,
    loading,
    error,
  };
}

/* =========================================================
   HOOK: SERVICE LANDING
   Service heading + description + image + cards/pages
========================================================= */

export function useServiceListing(slug) {
  const [state, setState] = useState({
    service: null,
    pages: [],
    loading: true,
    error: false,
  });

  const loadListing = useCallback(async () => {
    if (!slug) {
      setState({
        service: null,
        pages: [],
        loading: false,
        error: false,
      });
      return;
    }

    setState({
      service: null,
      pages: [],
      loading: true,
      error: false,
    });

    try {
      const [service, pages] = await Promise.all([
        fetchService(slug),
        fetchPages(slug),
      ]);

      setState({
        service,
        pages,
        loading: false,
        error: false,
      });
    } catch (err) {
      console.error(`Service listing API error (${slug}):`, err);

      setState({
        service: null,
        pages: [],
        loading: false,
        error: true,
      });
    }
  }, [slug]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!slug) {
        if (alive) {
          setState({
            service: null,
            pages: [],
            loading: false,
            error: false,
          });
        }
        return;
      }

      if (alive) {
        setState({
          service: null,
          pages: [],
          loading: true,
          error: false,
        });
      }

      try {
        const [service, pages] = await Promise.all([
          fetchService(slug),
          fetchPages(slug),
        ]);

        if (alive) {
          setState({
            service,
            pages,
            loading: false,
            error: false,
          });
        }
      } catch (err) {
        console.error(`Service listing API error (${slug}):`, err);

        if (alive) {
          setState({
            service: null,
            pages: [],
            loading: false,
            error: true,
          });
        }
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [slug]);

  return {
    ...state,
    refetch: loadListing,
  };
}

/* =========================================================
   HOOK: SERVICE DETAIL
   Individual card clicked -> full detail
========================================================= */

export function useServicePage(serviceSlug, pageSlug) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let alive = true;

    setState({
      data: null,
      loading: true,
      error: false,
    });

    if (!serviceSlug || !pageSlug) {
      setState({
        data: null,
        loading: false,
        error: false,
      });
      return () => {
        alive = false;
      };
    }

    fetchPage(serviceSlug, pageSlug)
      .then((data) => {
        if (alive) {
          setState({
            data,
            loading: false,
            error: false,
          });
        }
      })
      .catch((err) => {
        console.error(
          `Service page API error (${serviceSlug}/${pageSlug}):`,
          err
        );

        if (alive) {
          setState({
            data: null,
            loading: false,
            error: true,
          });
        }
      });

    return () => {
      alive = false;
    };
  }, [serviceSlug, pageSlug]);

  return state;
}

/* =========================================================
   SERVICE TYPES HELPERS (admin: Service → Service types)
========================================================= */

export const parseExtra = (extra) => {
  if (!extra) return {};
  if (typeof extra === "object") return extra;
  try {
    return JSON.parse(extra) || {};
  } catch {
    return {};
  }
};

export const getServiceTypes = (service) => {
  const extra = parseExtra(service?.extra);
  return Array.isArray(extra?.service_types)
    ? extra.service_types.filter(
        (t) => t && (t.heading || t.description || t.image)
      )
    : [];
};

// URL slug of a service type (from its heading)
export const typeSlug = (type) =>
  slugify(type?.heading || type?.title || type?.name || "");

/* =========================================================
   HOOK: SINGLE SERVICE (with extra.service_types)
========================================================= */

export function useService(slug) {
  const [state, setState] = useState({
    service: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let alive = true;
    setState({ service: null, loading: true, error: false });

    if (!slug) {
      setState({ service: null, loading: false, error: true });
      return () => {
        alive = false;
      };
    }

    fetchService(slug)
      .then((service) => {
        if (alive) setState({ service, loading: false, error: false });
      })
      .catch((err) => {
        console.error(`Service API error (${slug}):`, err);
        if (alive) setState({ service: null, loading: false, error: true });
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  return state;
}








