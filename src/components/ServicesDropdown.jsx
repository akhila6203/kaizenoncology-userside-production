
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useServicesWithContent } from "../api/services";

export default function ServicesDropdown() {
  const { services = [], loading } = useServicesWithContent();
  const [open, setOpen] = useState(false);

  const activeServices = services.filter(
    (service) => service.is_active !== false && service.status !== "inactive"
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 font-semibold text-[#263C30] transition hover:text-[#A34116]"
        aria-expanded={open}
      >
        Services
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 w-[280px] pt-3">
          <div className="overflow-hidden rounded-2xl border border-[#E4EAE1] bg-white p-2 shadow-xl">
            {loading ? (
              <p className="px-4 py-3 text-sm text-[#536357]">
                Loading services...
              </p>
            ) : activeServices.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#536357]">
                No services available.
              </p>
            ) : (
              activeServices.map((service) => (
                <Link
                  key={service.id || service.slug}
                  to={`/services/${service.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#263C30] transition hover:bg-[#F4F7F2] hover:text-[#A34116]"
                >
                  <span>{service.name}</span>
                  <ArrowRight
                    size={15}
                    className="shrink-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              ))
            )}

            <div className="mt-1 border-t border-[#E4EAE1] pt-1">
              <Link
                to="/services"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-[#476B55] hover:bg-[#F4F7F2]"
              >
                View All Services
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
