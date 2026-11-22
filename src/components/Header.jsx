
import { useEffect, useRef, useState } from "react";
// import { Link, NavLink } from "react-router-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { getSettingsApi } from "../api/settingsApi";
import axiosClient from "../api/axiosClient";


import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

import {
  Menu,
  X,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  HeartHandshake,
  BookOpen,
  PlayCircle,
  ArrowRight,
} from "lucide-react";

import * as LucideIcons from "lucide-react";
import { getSpecialities } from "../api/specialitiesApi";

import { hospital } from "../data/siteData";
import BrandLogo from "./BrandLogo";

const socials = [
  { label: "Facebook", key: "facebook_url", Icon: FaFacebookF },
  { label: "Instagram", key: "instagram_url", Icon: FaInstagram },
  { label: "YouTube", key: "youtube_url", Icon: FaYoutube },
  { label: "LinkedIn", key: "linkedin_url", Icon: FaLinkedinIn },
];

const getSpecialityIcon = (iconName) => {
  if (!iconName || typeof iconName !== "string") {
    return LucideIcons.Stethoscope;
  }

  const formattedName = iconName
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");

  return LucideIcons[formattedName] || LucideIcons.Stethoscope;
};


const navigation = [
  {
    label: "Home",
    path: "/",
  },
  // {
  //   label: "About Us",
  //   path: "/about",
  // },
  {
  label: "About Us",
  path: "/about",
  children: [
    {
      label: "Our Vision & Mission",
      path: "/about/vision-mission",
      Icon: HeartHandshake,
    },
  ],
},
{
  label: "Specialties",
  path: "/specialities",
  children: [],
},
 {
  label: "Our Technology",
  path: "/technology",
},
{
  label: "Services",
  path: "/services",
  children: [
    {
      label: "Cancer Types",
      path: "/services/cancer-types",
    },
    {
      label: "Screening & Diagnostics",
      path: "/services/screening-diagnostics",
    },
    // {
    //   label: "3D Mammography",
    //   path: "/services/screening-diagnostics/3d-mammography",
    // },
    // {
    //   label: "Screening & Early Detection",
    //   path: "/services/screening-diagnostics/screening-early-detection",
    // },
    // {
    //   label: "Diagnosis & Staging",
    //   path: "/services/screening-diagnostics/diagnosis-and-staging",
    // },
    // {
    //   label: "Pathology & Molecular Diagnostics",
    //   path: "/services/screening-diagnostics/pathology-molecular-diagnostics",
    // },
    {
      label: "Cancer Treatments",
      path: "/services/treatments",
    },
    // {
    //   label: "Technology & Equipment",
    //   path: "/technology",
    // },
    {
      label: "Second Opinion",
      path: "/services/second-opinion",
    },
  ],
},


  {
    label: "Our Doctors",
    path: "/doctors",
  },
  {
    label: "Patient Support",
    path: "/patient-care",
  },
  
{
  label: "Health Library",
  path: "/health-library",
  children: [
    {
      label: "Blogs",
      path: "/health-library/blogs",
      Icon: BookOpen,
    },
    {
      label: "Videos & FAQs",
      path: "/health-library/videos-faqs",
      Icon: PlayCircle,
    },
  ],
},

  {
    label: "Contact Us",
    path: "/contact",
  },
];


const getSettingsImageUrl = (imagePath) => {
  if (!imagePath) return "/logo2.jpg";

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseURL = axiosClient.defaults.baseURL || "";
  const apiOrigin = baseURL.replace(/\/api\/?$/, "");

  return `${apiOrigin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};


export default function Header() {
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [headerSpecialities, setHeaderSpecialities] = useState([]);

  const [settings, setSettings] = useState({});

  useEffect(() => {
  const loadHeaderSettings = async () => {
    try {
      const response = await getSettingsApi();

      const data = response?.data?.data || response?.data || {};

      setSettings(data);
    } catch (error) {
      console.error(
        "Header settings API error:",
        error.response?.data || error
      );
    }
  };

  loadHeaderSettings();
}, []);

const phoneNumber = settings.phone || hospital.phoneDisplay;
const phoneHref = settings.phone
  ? `tel:${settings.phone.replace(/[^\d+]/g, "")}`
  : hospital.phoneHref;

const email = settings.email || hospital.email;

const address = settings.address || hospital.address;
const logoUrl = getSettingsImageUrl(settings.logo);

const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  address || "Hyderabad, Telangana"
)}`;

  useEffect(() => {
    let active = true;

    const fetchHeaderSpecialities = async () => {
      try {
        const data = await getSpecialities({
          limit: 100,
          is_active: 1,
        });

        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.rows)
            ? data.rows
            : Array.isArray(data?.data)
              ? data.data
              : [];

        const mappedSpecialities = rows
          .filter((item) => item.is_active === 1 || item.is_active === true || item.is_active === "1")
          .map((item) => ({
            label: item.name || "",
            path: `/specialities/${item.slug}`,
            Icon: getSpecialityIcon(item.icon_name),
          }))
          .filter((item) => item.label && item.path);

        if (active) {
          setHeaderSpecialities(mappedSpecialities);
        }
      } catch (error) {
        console.error("Header specialities API error:", error);

        if (active) {
          setHeaderSpecialities([]);
        }
      }
    };

    fetchHeaderSpecialities();

    return () => {
      active = false;
    };
  }, []);

  const headerRef = useRef(null);
  const closeRef = useRef(null);
  const mobileMenuRef = useRef(null);

    const navigationItems = navigation.map((item) => {
    if (item.label === "Specialties") {
      const visibleSpecialities = headerSpecialities.slice(0, 8);

      return {
        ...item,
        children: [
          ...visibleSpecialities,
          {
            label: "View All Specialities",
            path: "/specialities",
            isViewAll: true,
          },
        ],
      };
    }

    return item;
  });

  const isMenuActive = (item) => {
  if (location.pathname === item.path) return true;

  return item.children?.some(
    (child) =>
      location.pathname === child.path ||
      location.pathname.startsWith(`${child.path}/`)
  ) || false;
};

  const closeAll = () => {
    setActiveDropdown(null);
    setOpen(false);
  };

  const toggleDropdown = (label) => {
    setActiveDropdown((current) =>
      current === label ? null : label
    );
  };

  // Close dropdown when clicking anywhere outside the header.
  useEffect(() => {
  const handleOutsideClick = (event) => {
    const clickedInsideHeader =
      headerRef.current?.contains(event.target);

    const clickedInsideMobileMenu =
      mobileMenuRef.current?.contains(event.target);

    if (!clickedInsideHeader && !clickedInsideMobileMenu) {
      setActiveDropdown(null);
    }
  };

  document.addEventListener("pointerdown", handleOutsideClick);

  return () => {
    document.removeEventListener(
      "pointerdown",
      handleOutsideClick
    );
  };
}, []);
  // useEffect(() => {
  //   const handleOutsideClick = (event) => {
  //     if (
  //       headerRef.current &&
  //       !headerRef.current.contains(event.target)
  //     ) {
  //       setActiveDropdown(null);
  //     }
  //   };

  //   document.addEventListener("pointerdown", handleOutsideClick);

  //   return () => {
  //     document.removeEventListener(
  //       "pointerdown",
  //       handleOutsideClick
  //     );
  //   };
  // }, []);

  // Close mobile menu on Escape.
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeAll();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      closeRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
         onMouseLeave={() => setActiveDropdown(null)}
        className="sticky top-0 z-[999] border-b border-line bg-white shadow-sm"
        // className="sticky top-0 z-50 border-b border-line bg-white shadow-sm"
      >
        {/* TOP INFORMATION STRIPn [#08614F] */}
        <div
          className="hidden bg-[#28563a]  lg:block"
        >
          <div className="page-container flex min-h-[44px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">

            {/* LEFT: LOCATION AND PHONE */}
            <div className="flex items-center gap-5 text-[15px] font-semibold text-white">

              <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-[#F0B08A]"
            >
              <MapPin size={17} />
              {address}
            </a>

              <span className="h-5 w-px bg-white/40" />

              <a
                href={phoneHref}
                className="flex items-center gap-2 transition hover:text-[#F0B08A]"
              >
                <Phone size={16} />
                {phoneNumber}
              </a>
            </div>

            {/* RIGHT: SOCIAL ICONS AND EMAIL */}
            <div className="flex items-center gap-5">

              <div className="flex items-center gap-4 text-white">
               {socials
                .filter((social) => settings[social.key]?.trim())
                .map(({ label, key, Icon }) => (
                  <a
                    key={label}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="transition hover:-translate-y-0.5 hover:text-[#F0B08A]"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>

              <span className="h-5 w-px bg-white/40" />

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-[15px] font-semibold text-white transition hover:text-[#F0B08A]"
              >
                <Mail size={17} />
                {email}
              </a>

            </div>
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="bg-white/95 backdrop-blur-md">
          <div className="page-container flex min-h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

            {/* <BrandLogo onClick={closeAll} compact /> */}
            <BrandLogo
            onClick={closeAll}
            compact
            logo={logoUrl}
          />

            {/* DESKTOP NAVIGATION */}
            <nav
            // className="ml-auto hidden items-center gap-4 min-[1300px]:flex xl:gap-5 2xl:gap-6"
             className="ml-auto hidden items-center gap-2 min-[1300px]:flex xl:gap-3 2xl:gap-4"
              aria-label="Main navigation"
            >
              {/* {navigation.map((item) => ( */}
                {navigationItems.map((item) => (
                <div
                  key={item.label}
                  className="relative z-10 flex items-center"
                  onMouseEnter={() => {
                    if (item.children) {
                      setActiveDropdown(item.label);
                    } else {
                      setActiveDropdown(null);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.children) {
                      setActiveDropdown((current) =>
                        current === item.label ? null : current
                      );
                    }
                  }}
                >
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setActiveDropdown(null)}
                    className={`whitespace-nowrap py-1 text-[16px] min-[1450px]:text-[17px] min-[1600px]:text-[18px] font-semibold transition-colors duration-200 ${
                    isMenuActive(item)
                      ? "text-[#A34116]"
                      : "text-heading hover:text-[#08614F]"
                    }`}
                  >
                    {item.label}
                  </NavLink>

                  {/* SEPARATE DROPDOWN ARROW */}
                  {item.children && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleDropdown(item.label);
                      }}
                      aria-label={`Open ${item.label} dropdown`}
                      aria-expanded={activeDropdown === item.label}
                      // className={`ml-1 rounded p-1 transition-colors ${
                      //   activeDropdown === item.label
                      //     ? "text-[#E98A43]"
                      //     : "text-ink hover:text-[#08614F]"
                      // }`}
                      className={`ml-1 rounded p-1 transition-colors ${
                        activeDropdown === item.label || isMenuActive(item)
                          ? "text-[#A34116]"
                          : "text-ink hover:text-[#08614F]"
                      }`}
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${
                          activeDropdown === item.label
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                  )}
  {/* DESKTOP DROPDOWN */}
{item.children && activeDropdown === item.label && (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
    className="absolute left-0 top-full z-[1000] w-[310px] pt-0"
    // className="absolute left-0 top-full z-[1000] w-[310px] pt-2"
  >
    <div className="overflow-hidden rounded-xl border border-line bg-white shadow-xl">
      <div className="max-h-[65vh] overflow-y-auto py-2">
        {item.children.map((child) => {
  const Icon = child.Icon;

  return (
    <NavLink
      key={child.label}
      to={child.path}
      onClick={closeAll}
      className={({ isActive }) =>
        child.isViewAll
          ? `flex min-h-[44px] items-center justify-center gap-2 border-t border-[#dce5da] px-5 py-3 text-[15px] font-bold transition-colors ${
              isActive
                ? "bg-[#F3F7F4] text-[#A34116]"
                : "bg-[#f6f9f6] text-[#4F7359] hover:bg-[#edf4ec] hover:text-[#A34116]"
            }`
          : `flex min-h-[38px] items-center gap-3 border-b border-line/60 px-5 py-2 text-[16px] font-medium transition-colors last:border-0 ${
              isActive
                ? "bg-[#F3F7F4] text-[#A34116]"
                : "text-ink hover:bg-[#F3F7F4] hover:text-[#A34116]"
            }`
      }
    >
      {child.isViewAll ? (
        <>
          <span>{child.label}</span>
          <ArrowRight size={17} />
        </>
      ) : (
        <>
          {Icon && (
            <Icon
              size={19}
              className="shrink-0 text-[#A34116]"
            />
          )}
          <span>{child.label}</span>
        </>
      )}
    </NavLink>
  );
})}
      </div>
    </div>
  </motion.div>
)}

                </div>
              ))}
            </nav>

            {/* APPOINTMENT AND MOBILE MENU */}
            {/* <div className="ml-auto flex shrink-0 items-center gap-2 2xl:ml-3"> */}
                <div className="ml-3 flex shrink-0 items-center gap-2 min-[1300px]:ml-2">
              <Link
                to="/appointments"
                className="btn-header hidden min-[1300px]:inline-flex"
              >
                <CalendarDays size={16} />
                Book an Appointment
              </Link>

              <button
                type="button"
                onClick={() => {
                  setOpen((value) => !value);
                  setActiveDropdown(null);
                }}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-navigation"className="rounded-xl border border-line p-2 text-navy min-[1300px]:hidden"
                // className="rounded-xl border border-line p-2 text-navy 2xl:hidden"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* MOBILE / TABLET NAVIGATION */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] 2xl:hidden">

            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/50"
              aria-label="Close menu overlay"
              onClick={closeAll}
            />

            <motion.aside
            ref={mobileMenuRef}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="absolute left-0 top-0 flex h-[100dvh] w-[min(100%,25rem)] flex-col bg-white shadow-lift"
            >

              {/* MOBILE HEADER */}
              <div className="flex items-center justify-between gap-3  px-2 py-2">

                {/* <BrandLogo onClick={closeAll} /> */}
                <BrandLogo
                  onClick={closeAll}
                  logo={logoUrl}
                />

                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeAll}
                  aria-label="Close navigation"
                  className="rounded-xl border border-line p-2 text-navy"
                >
                  <X size={21} />
                </button>

              </div>

              {/* MOBILE NAVIGATION ITEMS */}
              <nav className="hide-scroll flex-1 overflow-y-auto px-3 py-1">

                {/* {navigation.map((item) => ( */}
                {navigationItems.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-line"
                  >
                    <div className="flex items-center justify-between gap-2">

                      <NavLink
                        to={item.path}
                        end={item.path === "/"}
                        onClick={closeAll}
                        className={`flex-1 py-3 text-[17px] font-semibold ${
                          isMenuActive(item)
                            ? "text-[#A34116]"
                            : "text-[#4F7359] hover:text-[#A34116]"
                        }`}
                      >
                        {item.label}
                      </NavLink>

                      {item.children && (
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.label)}
                          aria-label={`Expand ${item.label}`}
                          aria-expanded={
                            activeDropdown === item.label
                          }
                          className="rounded-lg p-2 text-ink transition hover:bg-[#F3F7F4] hover:text-[#08614F]"
                        >
                          <ChevronDown
                            size={19}
                            className={`transition-transform ${
                              activeDropdown === item.label
                                ? "rotate-180 text-[#E98A43]"
                                : ""
                            }`}
                          />
                        </button>
                      )}

                    </div>

                    {/* MOBILE SUBMENU */}
                    <AnimatePresence>
                      {item.children &&
                        activeDropdown === item.label && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                            className="overflow-hidden"
                          >
                            <div className="mb-3 ml-2 border-l-2 border-[#E98A43]/40 pl-3">

                              {item.children.map((child) => {
                                  const Icon = child.Icon;

                                  return (
                                    <NavLink
                                      key={child.label}
                                      to={child.path}
                                      onClick={closeAll}
                                      className={({ isActive }) =>
                                        child.isViewAll
                                          ? `mt-2 flex items-center justify-center gap-2 border-t border-[#dce5da] py-3 text-[15px] font-bold transition ${
                                              isActive
                                                ? "text-[#A34116]"
                                                : "text-[#4F7359] hover:text-[#A34116]"
                                            }`
                                          : `flex items-center gap-3 py-3 text-[16px] font-medium transition ${
                                              isActive
                                                ? "text-[#A34116]"
                                                : "text-ink hover:text-[#A34116]"
                                            }`
                                      }
                                    >
                                      {child.isViewAll ? (
                                        <>
                                          {child.label}
                                          <ArrowRight size={17} />
                                        </>
                                      ) : (
                                        <>
                                          {Icon && (
                                            <Icon
                                              size={19}
                                              className="shrink-0 text-[#A34116]"
                                            />
                                          )}
                                          {child.label}
                                        </>
                                      )}
                                    </NavLink>
                                  );
                                })}

                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                ))}

                <Link
                  to="/appointments"
                  onClick={closeAll}
                  className="btn-primary mt-5 flex w-full items-center justify-center gap-2"
                >
                  <CalendarDays size={18} />
                  Book an Appointment
                </Link>

              </nav>

              {/* MOBILE CONTACT DETAILS */}
              <div className="space-y-3 border-t border-line bg-mist px-5 py-5 text-[16px] text-ink">

                <p className="font-bold text-navy">
                  Contact KIMS RENOVA
                </p>

                <p className="flex gap-3">
                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-royal"
                  />
                  {address}
                </p>

                <p className="flex gap-3">
                  <Phone
                    size={19}
                    className="shrink-0 text-royal"
                  />
                  <a href={phoneHref}>
                    {phoneNumber}
                  </a>
                </p>

                <p className="flex gap-3 break-all">
                  <Mail
                    size={19}
                    className="shrink-0 text-royal"
                  />
                  <a href={`mailto:${email}`}>
                    {email}
                  </a>
                </p>

                <div className="flex items-center gap-5 pt-2">
                  {socials
  .filter((social) => settings[social.key]?.trim())
  .map(({ label, key, Icon }) => (
    <a
      key={label}
      href={settings[key]}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-[#08614F] transition hover:text-[#E98A43]"
    >
      <Icon size={21} />
    </a>
  ))}
                </div>

              </div>

            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}












