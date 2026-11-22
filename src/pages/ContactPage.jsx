
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { hospital } from "../data/siteData";

import { useEffect, useState } from "react";
import { getSettingsApi } from "../api/settingsApi";

import toast from "react-hot-toast";
import { healthLibraryApi } from "../api/healthLibraryApi";

import appointmentsWave from "../assets/appointments-wave.jpg";

const socialConfig = [
  {
    name: "Facebook",
    key: "facebook_url",
    Icon: FaFacebookF,
  },
  {
    name: "Instagram",
    key: "instagram_url",
    Icon: FaInstagram,
  },
  {
    name: "YouTube",
    key: "youtube_url",
    Icon: FaYoutube,
  },
  {
    name: "LinkedIn",
    key: "linkedin_url",
    Icon: FaLinkedinIn,
  },
];


const getMapEmbedUrl = (location) => {
  const query = encodeURIComponent(
    `${location.location_name || ""}, ${location.address || ""}`
  );

  return `https://www.google.com/maps?q=${query}&output=embed`;
};

const getDirectionsUrl = (location) => {
  if (location.location_url) {
    return location.location_url;
  }

  const query = encodeURIComponent(
    `${location.location_name || ""}, ${location.address || ""}`
  );

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
};

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
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

        setLocations(
          Array.isArray(data.contacts)
            ? data.contacts
            : []
        );
      } catch (error) {
        console.error(
          "Contact settings loading error:",
          error.response?.data || error
        );

        toast.error("Unable to load hospital contact details.");
      }
    };

    loadSettings();
  }, []);


  const handleContactSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = new FormData();

    // Form type
    payload.append("type", "contact");

    // Contact details
    payload.append("patient_name", formData.get("name") || "");
    payload.append("email", formData.get("email") || "");
    payload.append("phone", formData.get("phone") || "");
    payload.append("message", formData.get("message") || "");

    try {
      setSubmitting(true);

    await healthLibraryApi.submit(payload);

toast.success(
  "Thank you for contacting us! Your enquiry has been submitted successfully. Our team will get in touch with you soon.",
  {
    duration: 5000,
    position: "top-center",
    style: {
      background: "#304b3c",
      color: "#ffffff",
      padding: "16px 22px",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: "600",
      maxWidth: "500px",
    },
    iconTheme: {
      primary: "#ffffff",
      secondary: "#304b3c",
    },
  }
);

      form.reset();
    } catch (error) {
      console.error(
        "Contact form submission error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to submit your enquiry. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-[#304b3c]">
   
<nav
  aria-label="Breadcrumb"
  className="relative overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
  style={{
    backgroundImage: `url(${appointmentsWave})`,
  }}
>
  <div className="page-container px-5 py-4 sm:px-8 lg:px-12">
    <ol className="flex items-center gap-2 text-[16px]">
      <li>
        <Link
          to="/"
          className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#f26322]"
        >
          Home
        </Link>
      </li>

      <li className="text-[#aab5aa]" aria-hidden="true">
        /
      </li>

      <li
        aria-current="page"
        className="font-bold text-white drop-shadow-md"
        // className="font-semibold text-[#263c30]"
      >
        Contact Us
      </li>
    </ol>
  </div>
</nav>

{/* CONTACT PAGE HEADING */}
{/* <section className="mx-auto w-full max-w-7xl px-5 pt-10 text-center sm:px-8 sm:pt-12 lg:px-12"> */}
<section className="page-container mx-auto w-full px-5 pt-10 text-center sm:px-8 sm:pt-12 lg:px-12">
  <p className="text-sm font-bold tracking-[0.18em] text-[#f26322]">
    CONTACT US
  </p>

  <h1 className="display-font mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-[#304b3c] sm:text-4xl lg:text-5xl">
    We're here to help you take the next step
  </h1>

  <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-[#304b3c]">
    Contact the hospital for general enquiries, directions and
    information about appointments.
  </p>
</section>
      {/* CONTACT INFORMATION + COMPACT FORM */}
      <section className="page-container mx-auto grid w-full items-start gap-6 px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-2 lg:gap-8 lg:px-12">
      {/* <section className="page-container mx-auto grid w-full max-w-7xl items-start gap-6 px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-2 lg:gap-8 lg:px-12"> */}
       

        {/* LEFT: TWO ADDRESSES + CONTACT NUMBERS */}
        <div className="space-y-4">
          {locations.map((location) => (
            <article
              // key={location.name}
              key={location.id}
              className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ice text-royal">
                <MapPin size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[16px] font-bold text-heading">
                  {location.location_name}
                </h2>

                <div className="mt-2 flex items-start gap-2">
                  <MapPin
                    size={17}
                    className="mt-1 shrink-0 text-royal"
                  />
                  <p className="text-[16px] leading-6 text-ink">
                    {location.address}
                  </p>
                </div>

                {location.phone && (
  <a
    href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}
    className="mt-3 flex items-start gap-2 text-[16px] font-semibold text-royal transition-colors hover:text-[#f26322]"
  >
    <Phone size={17} className="mt-0.5 shrink-0" />
    <span>{location.phone}</span>
  </a>
)}
                {location.email && (
  <a
    href={`mailto:${location.email}`}
    className="mt-2 flex items-start gap-2 break-all text-[16px] font-semibold text-royal transition-colors hover:text-[#f26322]"
  >
    <Mail size={17} className="mt-0.5 shrink-0" />
    <span>{location.email}</span>
  </a>
)}
              </div>
            </article>
          ))}

          {/* GENERAL CONTACT DETAILS */}
          <article className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ice text-royal">
              <Clock size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="text-[16px] font-bold text-heading">
                Opening hours
              </h2>
              <p className="mt-1 text-[16px] leading-6 text-ink">
                {hospital.hours}
              </p>
              <p className="mt-2 text-[16px] leading-6 text-ink">
                General email:{" "}
                <a
                  href={`mailto:${settings.email || hospital.email}`}
                  className="break-all font-semibold text-royal hover:text-[#f26322]"
                >
                  {settings.email || hospital.email}
                </a>
              </p>
            </div>
          </article>
          
          {/* FOLLOW US */}
{socialConfig.some((item) => settings[item.key]?.trim()) && (
  <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
    <h2 className="text-lg font-bold text-heading">Follow Us</h2>

    <p className="mt-1 text-[15px] text-ink">
      Stay connected with our healthcare updates.
    </p>

    <div className="mt-3 flex gap-3">
      {socialConfig
        .filter((item) => settings[item.key]?.trim())
        .map(({ name, key, Icon }) => (
          <a
            key={name}
            href={settings[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            title={name}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-royal transition duration-300 hover:-translate-y-1 hover:bg-royal hover:text-white"
          >
            <Icon size={19} />
          </a>
        ))}
    </div>
  </div>
)}
        </div>


        {/* RIGHT: SHORTER ENQUIRY FORM */}
        <form
  onSubmit={handleContactSubmit}
  className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6"
>
          <p className="text-sm font-bold tracking-[0.15em] text-[#f26322]">
            GET IN TOUCH
          </p>

          <h2 className="display-font mt-2 text-2xl font-semibold text-heading">
            Send an enquiry
          </h2>

          <p className="mt-1 text-[15px] leading-6 text-ink">
            Contact us for general enquiries and appointment information.
          </p>

          <div className="mt-3 space-y-2.5">
            <label className="block text-[15px] font-semibold text-heading">
              Your name *
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                placeholder="Enter your full name"
                className="field mt-1 w-full !min-h-0 !py-2"
              />
            </label>

            <label className="block text-[15px] font-semibold text-heading">
              Email address *
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="Enter your email address"
               className="field mt-1 w-full !min-h-0 !py-2"
              />
            </label>

            <label className="block text-[15px] font-semibold text-heading">
              Mobile number *
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                maxLength={20}
                placeholder="Enter your mobile number"
                className="field mt-1 w-full !min-h-0 !py-2"
              />
            </label>

            <label className="block text-[15px] font-semibold text-heading">
              How can we help? *
              <textarea
                name="message"
                required
                maxLength={2000}
                rows={2}
                placeholder="Write your enquiry here..."
                className="field mt-1 w-full !min-h-0 !py-2 resize-y"
                // className="field mt-1.5 min-h-[76px] w-full resize-y"
              />
            </label>

            <button
  type="submit"
  disabled={submitting}
  className="btn-primary group flex min-h-11 w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting ? "Submitting..." : "Submit Enquiry"}

  {!submitting && (
    <ArrowRight
      size={18}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  )}
</button>
          </div>
        </form>
      </section>


{/* MAPS SECTION */}
{locations.length > 0 && (
<section
  id="locations"
  className="page-container mx-auto mt-12 w-full scroll-mt-28 px-5 pb-12 sm:mt-16 sm:px-8 lg:px-12"
>
  <SectionTitle
    center={true}
    eyebrow="FIND US"
    title="Our Hospital Locations"
    description="Explore our locations and get directions to the hospital."
  />

  <div className="mt-7 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
    {locations.map((location) => (
      <article
        key={location.id}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        {/* GOOGLE MAP */}
        <div className="relative h-[240px] w-full shrink-0 bg-mist sm:h-[280px]">
          <iframe
            title={`Map - ${location.location_name}`}
            src={getMapEmbedUrl(location)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* LOCATION DETAILS */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-royal">
            {location.location_name}
          </h3>

          <div className="mt-3 flex items-start gap-3">
            <MapPin
              size={20}
              className="mt-0.5 shrink-0 text-ink"
            />
            <p className="text-[16px] leading-6 text-ink">
              {location.address || "Address not available"}
            </p>
          </div>

          {location.phone && (
            <a
              href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}
              className="mt-3 flex items-start gap-3 text-[16px] font-semibold text-royal hover:text-[#f26322]"
            >
              <Phone size={19} className="mt-0.5 shrink-0" />
              <span>{location.phone}</span>
            </a>
          )}

          {location.email && (
            <a
              href={`mailto:${location.email}`}
              className="mt-3 flex items-start gap-3 break-all text-[16px] font-semibold text-royal hover:text-[#f26322]"
            >
              <Mail size={19} className="mt-0.5 shrink-0" />
              <span>{location.email}</span>
            </a>
          )}

          <a
            href={getDirectionsUrl(location)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-royal px-4 py-2.5 text-[15px] font-semibold text-royal transition duration-300 hover:bg-royal hover:text-white"
          >
            Open in Maps
            <ExternalLink size={16} />
          </a>
        </div>
      </article>
    ))}
  </div>
</section>
)}

  </main>
);
}















// import {
//   MapPin,
//   Mail,
//   Phone,
//   Clock,
//   ArrowRight,
//   ExternalLink,
//   Globe,
//   Share2,
//   Video,
//   Users,
// } from "lucide-react";

// import { Link } from "react-router-dom";
// import SectionTitle from "../components/SectionTitle";
// import { hospital } from "../data/siteData";

// import { useState } from "react";
// import toast from "react-hot-toast";
// import { healthLibraryApi } from "../api/healthLibraryApi";

// import appointmentsWave from "../assets/appointments-wave.jpg";

// const socialLinks = [
//   {
//     name: "Facebook",
//     Icon: Globe,
//     href: "https://www.facebook.com/",
//   },
//   {
//     name: "Instagram",
//     Icon: Share2,
//     href: "https://www.instagram.com/",
//   },
//   {
//     name: "YouTube",
//     Icon: Video,
//     href: "https://www.youtube.com/",
//   },
//   {
//     name: "LinkedIn",
//     Icon: Users,
//     href: "https://www.linkedin.com/",
//   },
// ];

// const locations = [
//   {
//     name: "Care Hospitals - Hi-tech City",
//     address:
//       "Old Mumbai Hwy, near Cyberabad Police Commissionerate, Jayabheri Pine Valley, HITEC City, Hyderabad, Telangana 500032",
//     phone: "+91 915 414 3858/59/60",
//     email: "support@kimsrenova.com",
//     mapUrl:
//       "https://www.google.com/maps?q=CARE+Hospitals+Hi-Tech+City+Hyderabad&output=embed",
//     directionsUrl:
//       "https://www.google.com/maps/search/?api=1&query=CARE+Hospitals+Hi-Tech+City+Hyderabad",
//   },
//   {
//     name: "Care Hospitals - Banjara Hills",
//     address:
//       "Road Number 1, Prem Nagar, Banjara Hills, Hyderabad, Telangana 500034",
//     phone: "+91 915 414 3858/59/60",
//     email: "support@kimsrenova.com",
//     mapUrl:
//       "https://www.google.com/maps?q=CARE+Hospitals+Banjara+Hills+Hyderabad&output=embed",
//     directionsUrl:
//       "https://www.google.com/maps/search/?api=1&query=CARE+Hospitals+Banjara+Hills+Hyderabad",
//   },
// ];

// export default function ContactPage() {
//   const [submitting, setSubmitting] = useState(false);

//   const handleContactSubmit = async (event) => {
//     event.preventDefault();

//     if (submitting) return;

//     const form = event.currentTarget;
//     const formData = new FormData(form);

//     const payload = new FormData();

//     // Form type
//     payload.append("type", "contact");

//     // Contact details
//     payload.append("patient_name", formData.get("name") || "");
//     payload.append("email", formData.get("email") || "");
//     payload.append("phone", formData.get("phone") || "");
//     payload.append("message", formData.get("message") || "");

//     try {
//       setSubmitting(true);

//     await healthLibraryApi.submit(payload);

// toast.success(
//   "Thank you for contacting us! Your enquiry has been submitted successfully. Our team will get in touch with you soon.",
//   {
//     duration: 5000,
//     position: "top-center",
//     style: {
//       background: "#304b3c",
//       color: "#ffffff",
//       padding: "16px 22px",
//       borderRadius: "12px",
//       fontSize: "15px",
//       fontWeight: "600",
//       maxWidth: "500px",
//     },
//     iconTheme: {
//       primary: "#ffffff",
//       secondary: "#304b3c",
//     },
//   }
// );

// form.reset();

//       form.reset();
//     } catch (error) {
//       console.error(
//         "Contact form submission error:",
//         error.response?.data || error
//       );

//       toast.error(
//         error.response?.data?.message ||
//           "Unable to submit your enquiry. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//   <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-[#304b3c]">
   
// <nav
//   aria-label="Breadcrumb"
//   className="relative overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
//   style={{
//     backgroundImage: `url(${appointmentsWave})`,
//   }}
// >
//   <div className="page-container px-5 py-4 sm:px-8 lg:px-12">
//     <ol className="flex items-center gap-2 text-[16px]">
//       <li>
//         <Link
//           to="/"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#f26322]"
//         >
//           Home
//         </Link>
//       </li>

//       <li className="text-[#aab5aa]" aria-hidden="true">
//         /
//       </li>

//       <li
//         aria-current="page"
//         className="font-bold text-white drop-shadow-md"
//         // className="font-semibold text-[#263c30]"
//       >
//         Contact Us
//       </li>
//     </ol>
//   </div>
// </nav>

// {/* CONTACT PAGE HEADING */}
// {/* <section className="mx-auto w-full max-w-7xl px-5 pt-10 text-center sm:px-8 sm:pt-12 lg:px-12"> */}
// <section className="page-container mx-auto w-full px-5 pt-10 text-center sm:px-8 sm:pt-12 lg:px-12">
//   <p className="text-sm font-bold tracking-[0.18em] text-[#f26322]">
//     CONTACT US
//   </p>

//   <h1 className="display-font mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-[#304b3c] sm:text-4xl lg:text-5xl">
//     We're here to help you take the next step
//   </h1>

//   <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-7 text-[#304b3c]">
//     Contact the hospital for general enquiries, directions and
//     information about appointments.
//   </p>
// </section>
//       {/* CONTACT INFORMATION + COMPACT FORM */}
//       <section className="page-container mx-auto grid w-full items-start gap-6 px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-2 lg:gap-8 lg:px-12">
//       {/* <section className="page-container mx-auto grid w-full max-w-7xl items-start gap-6 px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-2 lg:gap-8 lg:px-12"> */}
       

//         {/* LEFT: TWO ADDRESSES + CONTACT NUMBERS */}
//         <div className="space-y-4">
//           {locations.map((location) => (
//             <article
//               key={location.name}
//               className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
//             >
//               <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ice text-royal">
//                 <MapPin size={22} />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <h2 className="text-[16px] font-bold text-heading">
//                   {location.name}
//                 </h2>

//                 <div className="mt-2 flex items-start gap-2">
//                   <MapPin
//                     size={17}
//                     className="mt-1 shrink-0 text-royal"
//                   />
//                   <p className="text-[16px] leading-6 text-ink">
//                     {location.address}
//                   </p>
//                 </div>

//                 <a
//                   href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}
//                   className="mt-3 flex items-start gap-2 text-[16px] font-semibold text-royal transition-colors hover:text-[#f26322]"
//                 >
//                   <Phone size={17} className="mt-0.5 shrink-0" />
//                   <span>{location.phone}</span>
//                 </a>

//                 <a
//                   href={`mailto:${location.email}`}
//                   className="mt-2 flex items-start gap-2 break-all text-[16px] font-semibold text-royal transition-colors hover:text-[#f26322]"
//                 >
//                   <Mail size={17} className="mt-0.5 shrink-0" />
//                   <span>{location.email}</span>
//                 </a>
//               </div>
//             </article>
//           ))}

//           {/* GENERAL CONTACT DETAILS */}
//           <article className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
//             <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ice text-royal">
//               <Clock size={22} />
//             </div>

//             <div className="min-w-0">
//               <h2 className="text-[16px] font-bold text-heading">
//                 Opening hours
//               </h2>
//               <p className="mt-1 text-[16px] leading-6 text-ink">
//                 {hospital.hours}
//               </p>
//               <p className="mt-2 text-[16px] leading-6 text-ink">
//                 General email:{" "}
//                 <a
//                   href={`mailto:${hospital.email}`}
//                   className="break-all font-semibold text-royal hover:text-[#f26322]"
//                 >
//                   {hospital.email}
//                 </a>
//               </p>
//             </div>
//           </article>
//           {/* FOLLOW US */}
//           <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
//             <h2 className="text-lg font-bold text-heading">Follow Us</h2>

//             <p className="mt-1 text-[15px] text-ink">
//               Stay connected with our healthcare updates.
//             </p>

//             <div className="mt-3 flex gap-3">
//               {socialLinks.map(({ name, Icon, href }) => (
//                 <a
//                   key={name}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={name}
//                   title={name}
//                   className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-royal transition duration-300 hover:-translate-y-1 hover:bg-royal hover:text-white"
//                 >
//                   <Icon size={19} />
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>


//         {/* RIGHT: SHORTER ENQUIRY FORM */}
//         <form
//   onSubmit={handleContactSubmit}
//   className="rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6"
// >
//           <p className="text-sm font-bold tracking-[0.15em] text-[#f26322]">
//             GET IN TOUCH
//           </p>

//           <h2 className="display-font mt-2 text-2xl font-semibold text-heading">
//             Send an enquiry
//           </h2>

//           <p className="mt-1 text-[15px] leading-6 text-ink">
//             Contact us for general enquiries and appointment information.
//           </p>

//           <div className="mt-3 space-y-2.5">
//             <label className="block text-[15px] font-semibold text-heading">
//               Your name *
//               <input
//                 name="name"
//                 type="text"
//                 autoComplete="name"
//                 required
//                 maxLength={100}
//                 placeholder="Enter your full name"
//                 className="field mt-1 w-full !min-h-0 !py-2"
//               />
//             </label>

//             <label className="block text-[15px] font-semibold text-heading">
//               Email address *
//               <input
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 maxLength={254}
//                 placeholder="Enter your email address"
//                className="field mt-1 w-full !min-h-0 !py-2"
//               />
//             </label>

//             <label className="block text-[15px] font-semibold text-heading">
//               Mobile number *
//               <input
//                 name="phone"
//                 type="tel"
//                 autoComplete="tel"
//                 required
//                 maxLength={20}
//                 placeholder="Enter your mobile number"
//                 className="field mt-1 w-full !min-h-0 !py-2"
//               />
//             </label>

//             <label className="block text-[15px] font-semibold text-heading">
//               How can we help? *
//               <textarea
//                 name="message"
//                 required
//                 maxLength={2000}
//                 rows={2}
//                 placeholder="Write your enquiry here..."
//                 className="field mt-1 w-full !min-h-0 !py-2 resize-y"
//                 // className="field mt-1.5 min-h-[76px] w-full resize-y"
//               />
//             </label>

//             <button
//   type="submit"
//   disabled={submitting}
//   className="btn-primary group flex min-h-11 w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
// >
//   {submitting ? "Submitting..." : "Submit Enquiry"}

//   {!submitting && (
//     <ArrowRight
//       size={18}
//       className="transition-transform duration-300 group-hover:translate-x-1"
//     />
//   )}
// </button>
//           </div>
//         </form>
//       </section>

//       {/* MAPS SECTION */}
//       <section
//   id="locations"
//   className="page-container mx-auto mt-12 w-full scroll-mt-28 px-5 pb-12 sm:mt-16 sm:px-8 lg:px-12"
//   // className="page-container mx-auto mt-12 w-full max-w-7xl scroll-mt-28 px-5 pb-12 sm:mt-16 sm:px-8 lg:px-12"
// >
//         <SectionTitle
//           center={true}
//           eyebrow="FIND US"
//           title="Our Hospital Locations"
//           description="Explore our locations and get directions to the hospital."
//         />

//         <div className="mt-7 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
//           {locations.map((location) => (
//             <article
//   key={location.name}
//   className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg"
// >
//               {/* GOOGLE MAP */}
//               <div className="relative h-[240px] w-full shrink-0 bg-mist sm:h-[280px]">
//                 <iframe
//                   title={`Map - ${location.name}`}
//                   src={location.mapUrl}
//                   width="100%"
//                   height="100%"
//                   style={{ border: 0 }}
//                   loading="lazy"
//                   referrerPolicy="no-referrer-when-downgrade"
//                   allowFullScreen
//                 />
//               </div>

//               {/* LOCATION DETAILS */}
//               <div className="p-5">
//                 <h3 className="text-lg font-bold text-royal">
//                   {location.name}
//                 </h3>

//                 <div className="mt-3 flex items-start gap-3">
//                   <MapPin
//                     size={20}
//                     className="mt-0.5 shrink-0 text-ink"
//                   />
//                   <p className="text-[16px] leading-6 text-ink">
//                     {location.address}
//                   </p>
//                 </div>

//                 <a
//                   href={`tel:${location.phone.replace(/[^+\d]/g, "")}`}
//                   className="mt-3 flex items-start gap-3 text-[16px] font-semibold text-royal hover:text-[#f26322]"
//                 >
//                   <Phone size={19} className="mt-0.5 shrink-0" />
//                   <span>{location.phone}</span>
//                 </a>

//                 <a
//                   href={`mailto:${location.email}`}
//                   className="mt-3 flex items-start gap-3 break-all text-[16px] font-semibold text-royal hover:text-[#f26322]"
//                 >
//                   <Mail size={19} className="mt-0.5 shrink-0" />
//                   <span>{location.email}</span>
//                 </a>

//                 <a
//                   href={location.directionsUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="mt-4 inline-flex items-center gap-2 rounded-full border border-royal px-4 py-2.5 text-[15px] font-semibold text-royal transition duration-300 hover:bg-royal hover:text-white"
//                 >
//                   Open in Maps
//                   <ExternalLink size={16} />
//                 </a>
//               </div>
//             </article>
//           ))}
//         </div>
//  </section>
//   </main>
// );
// }

