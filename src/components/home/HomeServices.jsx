
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cancerTypes } from "../../data/cancerTypeContent";

export default function HomeServices() {
  return (
    <section
        aria-labelledby="home-services-heading"
        className="section-padding bg-mist"
      >
      <div className="page-container px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-[13px] font-extrabold uppercase tracking-[0.18em] text-[#A34116] sm:text-sm">
            OUR SERVICES
          </p>

          <h2
  id="home-services-heading"
  className="display-font mt-3 text-3xl font-bold text-[#263C30] sm:text-4xl"
>
  Find Care by Cancer Type
</h2>

          <p className="mt-4 text-[15px] leading-7 text-[#343434] sm:text-[17px]">
            Learn about different cancer types, their symptoms, diagnosis and
            possible treatment approaches.
          </p>
        </div>

        {/* Cancer Types - 3 Cards Per Row */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cancerTypes.map((cancer, index) => (
            <motion.article
              key={cancer.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E4EAE1] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={cancer.image}
                  alt={cancer.imageAlt || cancer.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#263C30]/35 to-transparent" />

                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#476B55]">
                  {cancer.category || "CANCER TYPE"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-[#263C30] transition-colors group-hover:text-[#A34116]">
                  {cancer.title}
                </h3>

                <p className="mt-3 flex-1 text-[16px] leading-7 text-[#141414] sm:text-[18px]">
                  {cancer.cardDescription}
                </p>

                <Link
                  to={`/services/cancer/${cancer.slug}`}
                  className="mt-6 inline-flex min-h-10 items-center gap-2 self-start rounded-full bg-[#304B3C] px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-[#963D16]"
                >
                  Know More
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All */}
        <div className="mt-8 text-center">
          <Link
            to="/services/cancer-types"
            className="inline-flex items-center gap-2 rounded-full border border-[#476B55] px-4 py-2 text-sm font-bold text-[#476B55] transition duration-300 hover:border-[#963D16] hover:bg-[#963D16] hover:text-white"
          >
            Explore All Cancer Types
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}


