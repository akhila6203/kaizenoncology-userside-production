
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { getSettingsApi } from "../api/settingsApi";
import appointmentsWave from "../assets/appointments-wave.jpg";

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPrivacyPolicy = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getSettingsApi();

        const settings =
          response?.data?.data ||
          response?.data ||
          {};

        if (isMounted) {
          setContent(settings.privacy_policy || "");
        }
      } catch (err) {
        console.error(
          "Privacy Policy loading error:",
          err.response?.data || err
        );

        if (isMounted) {
          setError(true);
          setContent("");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPrivacyPolicy();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    // <main className="min-h-screen overflow-hidden bg-[#ffffff] text-[#304b3c]">
    <main className="min-h-screen w-full bg-[#ffffff] text-[#304b3c]">
      {/* BREADCRUMB - SAME STYLE AS CONTACT PAGE */}
      <nav
        aria-label="Breadcrumb"
        className="relative overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
        style={{
          backgroundImage: `url(${appointmentsWave})`,
        }}
      >
        <div className="page-container px-5 py-4 sm:px-8 lg:px-12">
          <ol className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
            <li>
              <Link
                to="/"
                className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#f26322]"
              >
                Home
              </Link>
            </li>

            <li className="text-white/70" aria-hidden="true">
              <ChevronRight size={16} />
            </li>

            <li
              aria-current="page"
              className="font-bold text-white drop-shadow-md"
            >
              Privacy Policy
            </li>
          </ol>
        </div>
      </nav>

      {/* CENTERED PAGE HEADING */}
      <section className="page-container w-full px-5 pt-10 text-center sm:px-8 sm:pt-12 lg:px-12 lg:pt-14">
        <p className="text-xs font-bold tracking-[0.18em] text-[#f26322] sm:text-sm">
          LEGAL INFORMATION
        </p>

        <h1 className="display-font mx-auto mt-3 max-w-4xl text-3xl font-bold leading-tight text-[#304b3c] sm:text-4xl lg:text-5xl">
          Privacy Policy
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[#3f4040] sm:text-base sm:leading-8">
          Your privacy matters to us. Read how we collect, use and protect
          information when you visit our website or interact with our services.
        </p>
      </section>

      {/* PRIVACY CONTENT */}
<section className="page-container w-full min-w-0 px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20">
  <div className="mx-auto w-full max-w-6xl min-w-0">
    {loading ? (
      <div className="animate-pulse space-y-5">
        <div className="h-6 w-1/3 rounded bg-[#e8eee8]" />
        <div className="h-4 w-full rounded bg-[#edf1ed]" />
        <div className="h-4 w-11/12 rounded bg-[#edf1ed]" />
        <div className="h-4 w-10/12 rounded bg-[#edf1ed]" />
        <div className="h-6 w-1/4 rounded bg-[#e8eee8]" />
        <div className="h-4 w-full rounded bg-[#edf1ed]" />
      </div>
    ) : error ? (
      <div className="py-10 text-center">
        <h2 className="text-lg font-semibold text-[#304b3c]">
          Unable to load Privacy Policy
        </h2>
        <p className="mt-2 text-base leading-7 text-[#78847b]">
          Please refresh the page and try again.
        </p>
      </div>
    ) : content.trim() ? (
      
<article
  className="
    w-full min-w-0
    text-[16px] leading-[1.8] text-[#526158]
    sm:text-[17px] sm:leading-[1.85]
    lg:text-[18px] lg:leading-[1.85]

    [overflow-wrap:break-word]
    [word-break:normal]

    [&_*]:max-w-full

    [&_p]:mb-5
    [&_p]:whitespace-normal
    [&_p]:text-inherit
    [&_p]:leading-[inherit]

    [&_h1]:mb-4 [&_h1]:mt-8
    [&_h1]:text-2xl [&_h1]:font-bold
    [&_h1]:leading-snug [&_h1]:text-[#304b3c]

    [&_h2]:mb-3 [&_h2]:mt-8
    [&_h2]:text-xl [&_h2]:font-bold
    [&_h2]:leading-snug [&_h2]:text-[#304b3c]

    [&_h3]:mb-3 [&_h3]:mt-6
    [&_h3]:text-lg [&_h3]:font-semibold
    [&_h3]:leading-snug [&_h3]:text-[#313232]

    [&_ul]:mb-6 [&_ul]:list-disc
    [&_ul]:space-y-2 [&_ul]:pl-6

    [&_ol]:mb-6 [&_ol]:list-decimal
    [&_ol]:space-y-2 [&_ol]:pl-6

    [&_li]:pl-1
    [&_li]:whitespace-normal
    [&_li]:text-inherit
    [&_li]:leading-[inherit]

    [&_strong]:font-bold
    [&_strong]:text-[#304b3c]

    [&_a]:text-[#222323]
    [&_a]:underline [&_a]:underline-offset-4
    [&_a]:[overflow-wrap:anywhere]
    [&_a]:[word-break:normal]

    [&_blockquote]:my-6
    [&_blockquote]:border-l-4
    [&_blockquote]:border-[#e87744]
    [&_blockquote]:bg-[#f6f9f6]
    [&_blockquote]:px-4 [&_blockquote]:py-4
    sm:[&_blockquote]:px-6

    [&_img]:my-6
    [&_img]:h-auto [&_img]:max-w-full
    [&_img]:rounded-lg

    [&_table]:my-6
    [&_table]:block [&_table]:w-full
    [&_table]:max-w-full [&_table]:overflow-x-auto

    [&_th]:min-w-[120px]
    [&_th]:border [&_th]:border-[#e5ebe6]
    [&_th]:bg-[#f3f7f3]
    [&_th]:p-3 [&_th]:text-left
    [&_th]:font-semibold [&_th]:text-[#333434]

    [&_td]:min-w-[120px]
    [&_td]:border [&_td]:border-[#e5ebe6]
    [&_td]:p-3
  "
  dangerouslySetInnerHTML={{ __html: content }}
/>

    ) : (
      <div className="py-10 text-center">
        <h2 className="text-lg font-semibold text-[#304b3c]">
          Privacy Policy content not available
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-base leading-7 text-[#78847b]">
          Privacy Policy information will be updated soon.
        </p>
      </div>
    )}
  </div>
</section>
    </main>
  );
}
