import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarCheck,
  UserRound,
  Phone,
  Mail,
  Clock,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

import toast from "react-hot-toast";
import { healthLibraryApi } from "../api/healthLibraryApi";

import { getDoctors } from "../api/doctorsApi";
import { getSpecialities } from "../api/specialitiesApi";

import appointmentsWave from "../assets/appointments-wave.jpg";

export default function AppointmentsPage() {
 
  const [submitting, setSubmitting] = useState(false);

  const [searchParams] = useSearchParams();

  const [specialities, setSpecialities] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [loading, setLoading] = useState(true);

  // FETCH SPECIALITIES AND DOCTORS FROM BACKEND
  useEffect(() => {
    let isActive = true;

    const fetchAppointmentData = async () => {
      try {
        setLoading(true);

        const [specialityResponse, doctorResponse] =
          await Promise.all([
            getSpecialities({ limit: 100 }),
            getDoctors({ limit: 100 }),
          ]);

        // Handle common API response structures
        const specialityRows = Array.isArray(specialityResponse)
          ? specialityResponse
          : Array.isArray(specialityResponse?.rows)
            ? specialityResponse.rows
            : Array.isArray(specialityResponse?.data?.rows)
              ? specialityResponse.data.rows
              : Array.isArray(specialityResponse?.data)
                ? specialityResponse.data
                : [];

        const doctorRows = Array.isArray(doctorResponse)
          ? doctorResponse
          : [];

        if (isActive) {
          setSpecialities(specialityRows);
          setDoctors(doctorRows);
        }
      } catch (error) {
        console.error("Appointment dropdown API error:", error);

        if (isActive) {
          setSpecialities([]);
          setDoctors([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchAppointmentData();

    return () => {
      isActive = false;
    };
  }, []);

  // GET UNIQUE LOCATIONS FROM BACKEND DOCTORS
  const locations = useMemo(() => {
    return [
      ...new Set(
        doctors
          .map((doctor) => doctor.hospital_location?.trim())
          .filter(Boolean)
      ),
    ];
  }, [doctors]);

  // FILTER DOCTORS BY SELECTED SPECIALITY AND LOCATION
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const doctorSpecialities = Array.isArray(doctor.speciality_names)
        ? doctor.speciality_names
        : typeof doctor.speciality_names === "string"
          ? doctor.speciality_names
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean)
          : doctor.speciality_name
            ? [doctor.speciality_name]
            : [];

      const specialityMatches =
        !selectedSpeciality ||
        doctorSpecialities.some(
          (name) =>
            name.trim().toLowerCase() ===
            selectedSpeciality.trim().toLowerCase()
        );

    const locationMatches =
  !selectedLocation ||
  selectedLocation === "No Preference" ||
  doctor.hospital_location?.trim() === selectedLocation;

      return specialityMatches && locationMatches;
    });
  }, [doctors, selectedSpeciality, selectedLocation]);

  // PREFILL DOCTOR FROM URL
  useEffect(() => {
    const doctorFromUrl = searchParams.get("doctor");

    if (!doctorFromUrl || doctors.length === 0) return;

    const matchingDoctor = doctors.find(
      (doctor) =>
        doctor.name?.trim().toLowerCase() ===
        doctorFromUrl.trim().toLowerCase()
    );

    if (matchingDoctor) {
      setSelectedDoctor(String(matchingDoctor.id));
    }
  }, [searchParams, doctors]);

const handleAppointmentSubmit = async (event) => {
  event.preventDefault();

  if (submitting) return;

  const form = event.currentTarget;
  const formData = new FormData(form);
  const payload = new FormData();

  payload.append("type", "estimate");

  payload.append("patient_name", formData.get("name") || "");
  payload.append("phone", formData.get("phone") || "");
  payload.append("email", formData.get("email") || "");

  payload.append("country", formData.get("cityCountry") || "");
  payload.append(
    "preferred_location",
    formData.get("preferredLocation") || ""
  );

  payload.append("age", formData.get("age") || "");
  payload.append("gender", formData.get("gender") || "");
  payload.append(
    "visited_before",
    formData.get("previousVisit") || ""
  );

  payload.append("appointment_date", formData.get("date") || "");
  payload.append("preferred_time", formData.get("time") || "");
  payload.append("department", formData.get("specialty") || "");

  const doctorValue = formData.get("doctor") || "";

  const selectedDoctorData = doctors.find(
    (doctor) => String(doctor.id) === String(doctorValue)
  );

  const doctorName =
    doctorValue === "no-preference"
      ? "No preference"
      : selectedDoctorData?.name || "";

  payload.append("preferred_doctor", doctorName);

  payload.append("message", formData.get("message") || "");

  payload.append(
    "contact_consent",
    formData.get("consent") ? "1" : "0"
  );

  // const reports = formData.getAll("reports");

  // reports.forEach((file) => {
  //   if (file instanceof File && file.size > 0) {
  //     payload.append("reports[]", file);
  //   }
  // });

  try {
    setSubmitting(true);

   await healthLibraryApi.submit(payload);

toast.success(
  "Your appointment request has been submitted successfully! Our team will contact you soon.",
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

setSelectedLocation("");
setSelectedSpeciality("");
setSelectedDoctor("");

    // Reset form without hiding it
    form.reset();

    setSelectedLocation("");
    setSelectedSpeciality("");
    setSelectedDoctor("");

  } catch (error) {
    console.error(
      "Appointment submission error:",
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message ||
        "Unable to submit your appointment request. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
};


  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdf9] text-[#304b3c]">
 
        {/* BREADCRUMB */}
<nav
  aria-label="Breadcrumb"
  className="relative overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
  style={{
    backgroundImage: `url(${appointmentsWave})`,
  }}
>
  <div className="page-container relative z-10 mx-auto px-5 py-4 sm:px-8 lg:px-12">
    <ol className="flex items-center gap-2 text-[15px]">
      <li>
        <Link
          to="/"
          className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#f26322]"
        >
          Home
        </Link>
      </li>

      <li className="text-white/90 drop-shadow-md" aria-hidden="true">
        /
      </li>

      <li
        aria-current="page"
        className="font-bold text-white drop-shadow-md"
      >
        Appointments
      </li>
    </ol>
  </div>
</nav>
{/* <nav
  aria-label="Breadcrumb"
  className="relative overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
  style={{
    backgroundImage: `url(${appointmentsWave})`,
  }}
>
  <div className="page-container relative z-10 mx-auto px-5 py-4 sm:px-8 lg:px-12">
          <ol className="flex items-center gap-2 text-[15px]">
            <li>
              <Link
                to="/"
                className="font-medium text-[#476b55] transition-colors hover:text-[#f26322]"
              >
                Home
              </Link>
            </li>

            <li className="text-[#aab5aa]" aria-hidden="true">
              /
            </li>

            <li
              aria-current="page"
              className="font-semibold text-[#263c30]"
            >
              Appointments
            </li>
          </ol>
        </div>
      </nav> */}

      {/* PAGE HEADING */}
      {/* <section className="mx-auto w-full max-w-5xl px-5 pt-10 text-center sm:px-8 sm:pt-12 lg:px-12"> */}
      <section className="page-container mx-auto w-full px-5 pt-6 text-center sm:px-8 sm:pt-8 lg:px-12">
        
        <p className="text-sm font-bold tracking-[0.18em] text-[#f26322]">
          APPOINTMENTS
        </p>
        {/* 
        <h1 className="display-font mx-auto mt-3 max-w-3xl text-3xl font-bold leading-tight text-[#304b3c] sm:text-4xl lg:text-5xl">
          Let's arrange your consultation
        </h1> */}
        <h1 className="display-font mx-auto mt-2 w-full text-3xl font-bold leading-tight text-[#304b3c] sm:text-4xl lg:whitespace-nowrap lg:text-5xl">
          Let's arrange your consultation
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-[17px] leading-7 text-[#304b3c]">
          Request an appointment with our healthcare team. Share your details
          and preferred consultation time so we can assist you.
        </p>
      </section>

      {/* APPOINTMENT FORM */}
      {/* <section className="mx-auto w-full max-w-6xl px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12"> */}
      <section className="page-container mx-auto w-full px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12">
        <div className="rounded-3xl border border-[#dce5da] bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          
            <form onSubmit={handleAppointmentSubmit}>
              {/* FORM TITLE */}
              <div className="mb-6">
                <p className="text-sm font-bold tracking-[0.16em] text-[#f26322]">
                  BOOK A CONSULTATION
                </p>

                <h2 className="display-font mt-2 text-2xl font-bold text-[#304b3c] sm:text-3xl">
                  Patient Information
                </h2>

                <p className="mt-2 text-[15px] leading-6 text-[#304b3c]">
                  Please complete the required details below.
                </p>
              </div>

              {/* PATIENT DETAILS */}
              {/* <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2"> */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-3">
                <label className="block text-[15px] font-semibold text-[#304b3c]">
                  Patient name <span className="text-[#f26322]">*</span>
                  <div className="relative mt-2">
                    <UserRound
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#52735d]"
                    />
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={100}
                      placeholder="Enter patient name"
                      className="min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] py-2.5 pl-10 pr-3 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
                    />
                  </div>
                </label>

                <label className="block text-[15px] font-semibold text-[#304b3c]">
                  Mobile number <span className="text-[#f26322]">*</span>
                  <div className="relative mt-2">
                    <Phone
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#52735d]"
                    />
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength={20}
                      placeholder="Enter mobile number"
                      className="min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] py-2.5 pl-10 pr-3 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
                    />
                  </div>
                </label>

                <label className="block text-[15px] font-semibold text-[#304b3c]">
                  Email address
                  <div className="relative mt-2">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#52735d]"
                    />
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      placeholder="Enter email address"
                      className="min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] py-2.5 pl-10 pr-3 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
                    />
                  </div>
                </label>
                {/* CITY / COUNTRY */}
<label className="block text-[15px] font-semibold text-[#304b3c]">
  City / Country

  <input
    name="cityCountry"
    type="text"
    autoComplete="country-name"
    maxLength={150}
    placeholder="Enter your city and country"
    className="mt-2 min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] px-3 py-2.5 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
  />
</label>
{/* PREFERRED Kaizen Oncology LOCATION */}
<label className="block text-[15px] font-semibold text-[#304b3c]">
  Preferred Kaizen Oncology Location

  <select
    name="preferredLocation"
    value={selectedLocation}
    onChange={(event) => {
      setSelectedLocation(event.target.value);
      setSelectedDoctor("");
    }}
    className="mt-2 min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] px-3 py-2.5 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
  >
    <option value="">
      {loading ? "Loading locations..." : "Choose a Kaizen Oncology location"}
    </option>

    {locations.map((location) => (
      <option key={location} value={location}>
        {location}
      </option>
    ))}

    <option value="No Preference">No Preference</option>
  </select>
</label>

                <label className="block text-[15px] font-semibold text-[#304b3c]">
                  Age
                  <input
                    name="age"
                    type="number"
                    min="0"
                    max="120"
                    placeholder="Enter age"
                    className="mt-2 min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] px-3 py-2.5 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
                  />
                </label>

                {/* GENDER */}
                <fieldset className="min-w-0">
                  <legend className="text-[15px] font-semibold text-[#304b3c]">
                    Gender
                  </legend>

                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                    {["Male", "Female", "Other"].map((gender) => (
                      <label
                        key={gender}
                        className="flex cursor-pointer items-center gap-2 text-[15px] font-normal text-[#304b3c]"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gender}
                          className="h-4 w-4 accent-[#304b3c]"
                        />
                        {gender}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* PREVIOUS CONSULTATION */}
                <fieldset className="min-w-0">
                  <legend className="text-[15px] font-semibold text-[#304b3c]">
                    Have you visited us before?
                  </legend>

                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
                    {["Yes", "No"].map((answer) => (
                      <label
                        key={answer}
                        className="flex cursor-pointer items-center gap-2 text-[15px] font-normal text-[#304b3c]"
                      >
                        <input
                          type="radio"
                          name="previousVisit"
                          value={answer}
                          className="h-4 w-4 accent-[#304b3c]"
                        />
                        {answer}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* DATE */}
                <label className="block text-[15px] font-semibold text-[#304b3c]">
                  Preferred appointment date{" "}
                  <span className="text-[#f26322]">*</span>
                  <div className="relative mt-2">
                    <CalendarCheck
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#52735d]"
                    />
                    <input
                      name="date"
                      type="date"
                      min={new Date().toLocaleDateString("en-CA")}
                      required
                      className="min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] py-2.5 pl-10 pr-3 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
                    />
                  </div>
                </label>

                {/* TIME */}
                <label className="block text-[15px] font-semibold text-[#304b3c]">
                  Preferred appointment time
                  <div className="relative mt-2">
                    <Clock
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#52735d]"
                    />
                    <input
                      name="time"
                      type="time"
                      className="min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] py-2.5 pl-10 pr-3 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
                    />
                  </div>
                </label>

               {/* DEPARTMENT */}
<label className="block text-[15px] font-semibold text-[#304b3c]">
  Department <span className="text-[#f26322]">*</span>

  <div className="relative mt-2">
    <Stethoscope
      size={18}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#52735d]"
    />

    <select
      name="specialty"
      required
      value={selectedSpeciality}
      onChange={(event) => {
        setSelectedSpeciality(event.target.value);
        setSelectedDoctor("");
      }}
      className="min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] py-2.5 pl-10 pr-3 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
    >
      <option value="" disabled>
        {loading ? "Loading departments..." : "Choose a department"}
      </option>

      {specialities.map((speciality) => {
        const name = speciality.name || speciality.title;

        if (!name) return null;

        return (
          <option
            key={speciality.id || speciality.slug || name}
            value={name}
          >
            {name}
          </option>
        );
      })}
    </select>
  </div>
</label>

              
                {/* PREFERRED DOCTOR */}
<label className="block text-[15px] font-semibold text-[#304b3c]">
  Preferred Doctor

  <select
    name="doctor"
    value={selectedDoctor}
    onChange={(event) => setSelectedDoctor(event.target.value)}
    className="mt-2 min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] px-3 py-2.5 text-[15px] font-normal text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
  >
    <option value="">
      {loading
        ? "Loading doctors..."
        : filteredDoctors.length > 0
          ? "Choose a doctor (optional)"
          : "No doctors available"}
    </option>

    <option value="no-preference">
      No preference
    </option>

    {filteredDoctors.map((doctor) => (
      <option key={doctor.id} value={String(doctor.id)}>
        {doctor.name}
        {doctor.designation ? ` - ${doctor.designation}` : ""}
      </option>
    ))}
  </select>
</label>

                {/* MESSAGE */}
                {/* <label className="block text-[15px] font-semibold text-[#304b3c] md:col-span-2"> */}
                <label className="block text-[15px] font-semibold text-[#304b3c]">
                  Additional information
                  <textarea
                    name="message"
                    rows={3}
                    maxLength={2000}
                    placeholder="Tell us briefly how we can help (optional)"
                    className="mt-2 min-h-20 w-full resize-y rounded-xl border border-[#cfded0] bg-[#fffdf9] px-3 py-2.5 text-[15px] font-normal leading-6 text-[#304b3c] outline-none transition focus:border-[#304b3c] focus:ring-2 focus:ring-[#304b3c]/10"
                  />
                </label>
                {/* UPLOAD REPORTS - OPTIONAL */}
            {/* <label className="block text-[15px] font-semibold text-[#304b3c] md:col-span-2"> */}
              {/* <label className="block text-[15px] font-semibold text-[#304b3c]">
                Upload Reports <span className="font-normal">(Optional)</span>

                <input
                  name="reports"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  multiple
                  className="mt-2 block min-h-11 w-full rounded-xl border border-[#cfded0] bg-[#fffdf9] px-3 py-2 text-[14px] font-normal text-[#304b3c] outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#e8f0ea] file:px-4 file:py-2 file:font-semibold file:text-[#304b3c] hover:file:bg-[#dce9df] focus:border-[#304b3c]"
                />

                <span className="mt-1 block text-[13px] font-normal text-[#52735d]">
                  You can upload medical reports, scans or prescriptions.
                  Accepted formats: PDF, JPG, PNG, DOC and DOCX.
                </span>
              </label> */}
              </div>

              {/* CONSENT */}
              <label className="mt-5 flex items-start gap-3 text-[15px] leading-6 text-[#304b3c]">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-[#304b3c]"
                />
                <span>
                  I agree to be contacted regarding this appointment request.
                </span>
              </label>

              {/* SUBMIT */}
              <button
  type="submit"
  disabled={submitting}
  className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#304b3c] px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3D5A47] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
>
  {submitting ? "Submitting..." : "Submit Appointment Request"}

  {!submitting && (
    <ArrowRight
      size={18}
      className="transition-transform duration-300 group-hover:translate-x-1"
    />
  )}
</button>

              
            </form>
        </div>
      </section>
    </main>
  );
}
