
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BriefcaseMedical, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getDoctors } from "../../api/doctorsApi";
import { mediaUrl } from "../../api/specialitiesApi";


export default function HomeDoctors() {
  const reduceMotion = useReducedMotion();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ACTIVE DOCTORS FROM BACKEND
  useEffect(() => {
    let isActive = true;

    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const rows = await getDoctors({ limit: 100 });

        const formattedDoctors = rows.map((doctor) => {
          const specialityNames = Array.isArray(doctor.speciality_names)
            ? doctor.speciality_names
            : typeof doctor.speciality_names === "string"
              ? doctor.speciality_names
                  .split(",")
                  .map((name) => name.trim())
                  .filter(Boolean)
              : doctor.speciality_name
                ? [doctor.speciality_name]
                : [];

          return {
            ...doctor,
            specialityNames,
            speciality:
              specialityNames.join(", ") ||
              doctor.speciality_name ||
              "Oncology",
            image: mediaUrl(doctor.photo),
            experience: doctor.experience_years ?? 0,
            location: doctor.hospital_location || "",
          };
        });

        if (isActive) {
          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error("Home doctors API error:", error);

        if (isActive) {
          setDoctors([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchDoctors();

    return () => {
      isActive = false;
    };
  }, []);

  // Homepage lo first 4 backend doctors matrame display
  const homeDoctors = doctors.slice(0, 4);

  // Avoid showing an empty doctors section while loading
  if (loading || homeDoctors.length === 0) {
    return null;
  }

  return (
    <section
  aria-labelledby="home-doctors-heading"
  className="section-padding bg-mist"
>
      <div className="page-container">

        {/* Heading */}
        <div className="mx-auto mb-9 max-w-3xl text-center">
          <span className="text-sm font-bold tracking-[0.18em] text-[#B94C1C]">
            OUR SPECIALISTS
          </span>

          <h2
  id="home-doctors-heading"
  className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl"
>
            Meet the Experts Behind Your Care
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#494848] sm:text-lg">
            Meet our experienced oncology specialists, dedicated to
            providing personalised guidance and compassionate cancer care.
          </p>
        </div>

        {/* Doctors Cards - Same design as Doctors Page */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {homeDoctors.map((doctor, index) => (
            <motion.article
              key={doctor.id}
              initial={{
                opacity: 0,
                y: reduceMotion ? 0 : 22,
              }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: reduceMotion ? 0 : index * 0.1,
              }}
              whileHover={reduceMotion ? {} : { y: -5 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 hover:shadow-premium"
            >
              {/* Doctor Image */}
              <Link
                to={`/doctors/${doctor.slug}`}
                aria-label={`View ${doctor.name} profile`}
                className="block overflow-hidden bg-ice"
              >
                <div className="h-[245px] overflow-hidden sm:h-[220px] lg:h-[205px] xl:h-[235px]">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>

              {/* Doctor Details */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="font-display text-lg font-bold leading-snug text-navy">
                  {doctor.name}
                </h3>

                <p className="mt-1 text-base leading-6 text-[#647368]">
                  {doctor.designation}
                </p>

                <p className="mt-1 text-base font-semibold leading-6 text-royal">
                  {doctor.speciality}
                </p>

                <div className="mt-3 space-y-2 text-base text-[#647368]">
                  <p className="flex items-start gap-2">
                    <BriefcaseMedical
                      aria-hidden="true"
                      size={16}
                      className="mt-1 shrink-0 text-royal"
                    />
                    <span>{doctor.experience}+ Years Experience</span>
                  </p>

                  <p className="flex items-start gap-2">
                    <MapPin
                      aria-hidden="true"
                      size={16}
                      className="mt-1 shrink-0 text-royal"
                    />
                    <span>{doctor.location}</span>
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
                  <Link
                    to={`/doctors/${doctor.slug}`}
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded-full border border-royal px-2 py-2 text-center text-sm font-bold text-royal transition hover:bg-royal hover:text-white"
                  >
                    View Profile
                    <ArrowRight aria-hidden="true" size={13} />
                  </Link>

                  <Link
                    to={`/appointments?doctor=${encodeURIComponent(doctor.name)}`}
                    className="inline-flex min-h-10 items-center justify-center rounded-full border border-royal bg-royal px-2 py-2 text-center text-sm font-bold text-white transition hover:border-navy hover:bg-navy"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Specialists Button */}
        <div className="mt-9 flex justify-center">
          <Link
            to="/doctors"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Specialists
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}

