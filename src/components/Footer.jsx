
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { getSettingsApi } from "../api/settingsApi";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { hospital } from "../data/siteData";

import logo from "../assets/logo3.jpg";

const socials = [
  {
    label: "Facebook",
    key: "facebook_url",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    key: "instagram_url",
    Icon: FaInstagram,
  },
  {
    label: "YouTube",
    key: "youtube_url",
    Icon: FaYoutube,
  },
  {
    label: "LinkedIn",
    key: "linkedin_url",
    Icon: FaLinkedinIn,
  },
];


const quickLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Specialties", path: "/specialities" },
  { label: "Our Technology", path: "/technology" },
  { label: "Our Doctors", path: "/doctors" },
  { label: "Patient Support", path: "/patient-care" },
  { label: "Contact Us", path: "/contact" },
];

const serviceLinks = [
  {
    label: "Cancer Types",
    path: "/services/cancer-types",
  },
  {
    label: "Screening & Diagnostics",
    path: "/services/screening-diagnostics",
  },
  {
    label: "Cancer Treatments",
    path: "/services/treatments",
  },
  {
    label: "Second Opinion",
    path: "/services/second-opinion",
  },
];

const libraryLinks = [
  {
    label: "Blogs",
    path: "/health-library/blogs",
  },
  {
    label: "Videos & FAQs",
    path: "/health-library/videos-faqs",
  },
];

const getImageUrl = (imagePath) => {
  if (!imagePath) return logo;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const baseURL = axiosClient.defaults.baseURL || "";
  const apiOrigin = baseURL.replace(/\/api\/?$/, "");

  return `${apiOrigin}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await getSettingsApi();

        const data =
          response?.data?.data ||
          response?.data ||
          {};

        setSettings(data);
      } catch (error) {
        console.error(
          "Footer settings loading error:",
          error.response?.data || error
        );

        toast.error("Unable to load footer contact details.");
      }
    };

    loadSettings();
  }, []);

  const phoneNumbers = [
    settings.phone,
    settings.alt_phone,
  ].filter((number) => number?.trim());

  return (
    <footer
      className="site-footer"
      style={{
        background: "#2F4638",
        color: "#ffffff",
      }}
    >
      {/* MAIN FOOTER */}
      <div className="page-container px-5 pt-10 pb-8 sm:px-8 sm:pt-12 lg:px-10 2xl:px-12">

        {/* FIVE COLUMNS */}
        {/* <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 xl:grid-cols-[30%_16%_16%_16%_22%] xl:gap-x-0"> */}
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 xl:grid-cols-[30%_20%_20%_30%] xl:gap-x-0">


          {/* COLUMN 1 - LOGO AND DESCRIPTION */}
          {/* <div className="min-w-0"> */}
          <div className="min-w-0 xl:pr-8">

            <Link
              to="/"
              className="inline-flex items-center"
            >
              <img
                src={getImageUrl(settings.logo)}
                alt={`${hospital.name} ${hospital.nameLine2}`}
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-sm text-[16px] leading-7 text-white sm:text-[17px]">
              KIMS RENOVA is dedicated to comprehensive cancer care, bringing together specialist expertise,
               advanced diagnostic and treatment approaches,
               personalised care planning and compassionate support throughout every stage of the cancer journey.
            </p>

           {/* SOCIAL MEDIA */}
            {socials.some((social) => settings[social.key]?.trim()) && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
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
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition duration-200 hover:border-[#F0B08A] hover:bg-[#F0B08A] hover:text-[#2F4638]"
                    >
                      <Icon size={19} />
                    </a>
                  ))}
              </div>
            )}

          </div>

          {/* COLUMN 2 - QUICK LINKS */}
          {/* <div className="min-w-0"> */}
        <div className="min-w-0 xl:px-3">

            <h3 className="mb-5 text-[20px] font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">

              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-[17px] leading-7 text-white transition-colors duration-200 hover:text-[#F0B08A]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

            </ul>

          </div>

          
{/* COLUMN 3 - SERVICES AND HEALTH LIBRARY */}
<div className="min-w-0 xl:px-3">

  {/* SERVICES */}
  <h3 className="mb-5 text-[20px] font-semibold text-white">
    Services
  </h3>

  <ul className="space-y-3">
    {serviceLinks.map((item) => (
      <li key={item.label}>
        <Link
          to={item.path}
          className="text-[17px] leading-7 text-white transition-colors duration-200 hover:text-[#F0B08A]"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>

  {/* HEALTH LIBRARY */}
  <h3 className="mb-5 mt-8 text-[20px] font-semibold text-white">
    Health Library
  </h3>

  <ul className="space-y-3">
    {libraryLinks.map((item) => (
      <li key={item.label}>
        <Link
          to={item.path}
          className="text-[17px] leading-7 text-white transition-colors duration-200 hover:text-[#F0B08A]"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>

</div>


          {/* COLUMN 4 - CONTACT US */}
          {/* <div className="min-w-0"> */}
          <div className="min-w-0 xl:pl-5">

            <h3 className="mb-5 text-[20px] font-semibold text-white">
              Contact Us
            </h3>

            <div className="space-y-5 text-[18px] leading-7 text-white">

  
             {/* LOCATION */}
{settings.address && (
  <p className="flex items-start gap-3">
    <MapPin
      size={20}
      className="mt-1 shrink-0 text-[#F0B08A]"
    />

    <span>{settings.address}</span>
  </p>
)}

              {/* PHONE NUMBERS */}
{phoneNumbers.length > 0 && (
  <div className="flex items-start gap-3">
    <Phone
      size={20}
      className="mt-1 shrink-0 text-[#F0B08A]"
    />

    <div className="flex flex-col gap-1">
      {phoneNumbers.map((number, index) => (
        <a
          key={`${number}-${index}`}
          href={`tel:${number.replace(/[^\d+]/g, "")}`}
          className="transition hover:text-[#F0B08A]"
        >
          {number}
        </a>
      ))}
    </div>
  </div>
)}

              {/* EMAIL */}
{settings.email && (
  <p className="flex items-start gap-3">
    <Mail
      size={20}
      className="mt-1 shrink-0 text-[#F0B08A]"
    />

    <a
      href={`mailto:${settings.email}`}
      className="break-all transition hover:text-[#F0B08A]"
    >
      {settings.email}
    </a>
  </p>
)}

              {/* WORKING HOURS */}
              <p className="flex items-start gap-3">
                <Clock
                  size={20}
                  className="mt-1 shrink-0 text-[#F0B08A]"
                />

                <span>{hospital.hours}</span>
              </p>

              

              {/* BOOK APPOINTMENT */}
              <div className="pt-2">

                <Link
                  to="/appointments"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/50 px-4 py-3 text-[16px] font-semibold text-white transition duration-200 hover:border-[#F0B08A] hover:bg-[#F0B08A] hover:text-[#2F4638]"
                >
                  Book an Appointment
                  <ArrowUpRight size={17} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="w-full border-t border-white/30">

        <div className="page-container flex flex-col justify-between gap-3 px-5 py-4 text-[15px] leading-7 text-white sm:flex-row sm:px-8 lg:px-12">

          <p>
            © {new Date().getFullYear()} {hospital.name}.
            All rights reserved.
          </p>

          <p>
            Educational information does not replace professional medical advice, diagnosis or treatment. 
            {/* Educational information does not replace
            professional medical advice. */}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-medium">
  <Link
    to="/terms-and-conditions"
    className="text-white/90 transition hover:text-[#F0B08A]"
  >
    Terms & Conditions
  </Link>

  <Link
    to="/privacy-policy"
    className="text-white/90 transition hover:text-[#F0B08A]"
  >
    Privacy Policy
  </Link>
</div>

        </div>

      </div>

    </footer>
  );
}












