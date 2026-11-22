
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { slides } from "../data/siteData";

export default function HeroSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const next = () => {
    setActive((current) => (current + 1) % slides.length);
  };

  const previous = () => {
    setActive(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    if (paused || reduceMotion || slides.length <= 1) return;

    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [paused, reduceMotion]);

  const slide = slides[active];
  const duration = reduceMotion ? 0 : 0.7;

  return (
    <section
  aria-label="Featured hospital information"
  aria-roledescription="carousel"
  className="hero-slider relative isolate overflow-hidden bg-[#2F4638]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          initial={{
            opacity: 0,
            scale: reduceMotion ? 1 : 1.04,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${slide.image}")`,
          }}
          aria-hidden="true"
        />
      </AnimatePresence>

      {/* Green Brand Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#243528]/95 via-[#3D5A47]/75 to-[#4F7359]/25"
      />

      {/* Hero Content */}
      <div className="page-container relative flex min-h-[400px] items-center px-6 py-12 sm:min-h-[460px] sm:px-12 sm:py-14 lg:min-h-[520px] lg:px-16 lg:py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{
              opacity: 0,
              y: reduceMotion ? 0 : 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: reduceMotion ? 0 : -10,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.45,
            }}
            className="max-w-4xl pb-8 text-white"
          >
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold tracking-[0.14em] backdrop-blur-sm sm:text-sm">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-[#B94C1C]"
              />
              {slide.eyebrow}
            </span>

            {/* Heading */}
            <h1 className="display-font mt-6 max-w-4xl text-[1.9rem] font-bold leading-[1.15] text-white sm:text-[2.5rem] lg:text-[3rem] xl:text-[3.3rem]">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/95 sm:text-lg sm:leading-8">
              {slide.description}
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-row flex-wrap gap-3 sm:gap-4">
            {/* <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4"> */}
              <Link
                to={slide.primaryPath}
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full bg-[#963D16] px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#963D16] hover:shadow-lg sm:min-h-[42px] sm:px-5 sm:py-2 sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {slide.primary}
                <ChevronRight size={19} />
              </Link>

              <Link
                to={slide.secondaryPath}
                className="inline-flex min-h-[38px] items-center justify-center rounded-full border border-white/70 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#3D5A47] sm:min-h-[48px] sm:px-4 sm:py-2 sm:text-[17px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {slide.secondary}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={previous}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/50 bg-[#243528]/50 p-2.5 text-white transition hover:border-[#963D16] hover:bg-[#963D16] sm:left-6 sm:p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <ArrowLeft size={19} aria-hidden="true" />
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/50 bg-[#243528]/50 p-2.5 text-white transition hover:border-[#963D16] hover:bg-[#963D16] sm:right-6 sm:p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <ArrowRight size={19} aria-hidden="true" />
      </button>

      {/* Slide Indicators */}
      <div
  className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center gap-2 sm:bottom-8"
  role="group"
  aria-label="Choose hero slide"
>
        {slides.map((item, index) => (
          <button
            key={item.title}
            type="button"
            aria-pressed={index === active}
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
              index === active
                ? "w-8 bg-[#963D16]"
                : "w-2.5 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

