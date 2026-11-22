
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Clock3,
  BookOpen,
  CalendarDays,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

import {
  getBlogBySlug,
  getBlogs,
} from "../api/blogsApi";

import { getSpecialities } from "../api/specialitiesApi";
import * as LucideIcons from "lucide-react";

import appointmentsWave from "../assets/appointments-wave.jpg";

const formatAddedDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

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

export default function HealthLibraryArticlePage() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recentBlogs, setRecentBlogs] = useState([]);
  const [specialities, setSpecialities] = useState([]);

  // FETCH CURRENT BLOG
  useEffect(() => {
    let active = true;

    const loadBlog = async () => {
      setLoading(true);

      try {
        const data = await getBlogBySlug(slug);

        if (active) {
          setBlog(data);
        }
      } catch (error) {
        console.error("Unable to load article:", error);

        if (active) {
          setBlog(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadBlog();

    return () => {
      active = false;
    };
  }, [slug]);

  // FETCH RECENT BLOGS
  useEffect(() => {
    let active = true;

    const loadRecentBlogs = async () => {
      try {
        const data = await getBlogs({});

        if (active) {
          const blogList = Array.isArray(data)
            ? data
            : data?.rows || data?.data?.rows || data?.data || [];

          setRecentBlogs(blogList);
        }
      } catch (error) {
        console.error("Unable to load recent blogs:", error);

        if (active) {
          setRecentBlogs([]);
        }
      }
    };

    loadRecentBlogs();

    return () => {
      active = false;
    };
  }, []);

  // FETCH SPECIALITIES
  useEffect(() => {
    let active = true;

    const loadSpecialities = async () => {
      try {
        const response = await getSpecialities({
          is_active: 1,
          limit: 100,
        });

        const rows = Array.isArray(response)
          ? response
          : response?.rows ||
            response?.data?.rows ||
            response?.data ||
            [];

        if (active) {
          setSpecialities(rows);
        }
      } catch (error) {
        console.error("Unable to load specialities:", error);

        if (active) {
          setSpecialities([]);
        }
      }
    };

    loadSpecialities();

    return () => {
      active = false;
    };
  }, []);

  // EXCLUDE CURRENT BLOG FROM RECENT BLOGS
  const sidebarRecentBlogs = recentBlogs
  .filter((item) => item.slug !== slug)
  .slice(0, 10);

  // LOADING
  if (loading) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-white">
        <p className="font-semibold text-[#4F7359]">
          Loading article...
        </p>
      </main>
    );
  }

  // ARTICLE NOT FOUND
  if (!blog) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-white px-5">
        <div className="text-center">
          <BookOpen
            size={52}
            className="mx-auto text-[#4F7359]"
          />

          <h1 className="display-font mt-5 text-3xl font-extrabold text-[#243528]">
            Article Not Found
          </h1>

          <p className="mt-4 text-base text-[#3D4A40]">
            Sorry, the requested article could not be found.
          </p>

          <Link
            to="/health-library/blogs"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4F7359] px-7 py-3 text-base font-bold text-white transition hover:bg-[#963D16]"
          >
            <ArrowLeft size={18} />
            View All Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">

      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
        style={{
          backgroundImage: `url(${appointmentsWave})`,
        }}
      >
        <div className="page-container relative z-10 mx-auto px-5 py-4 sm:px-8 lg:px-12">
          <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm">
            <li>
              <Link
                to="/"
                className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
              >
                Home
              </Link>
            </li>

            <li className="text-white/90 drop-shadow-md" aria-hidden="true">
              /
            </li>

            <li>
              <Link
                to="/health-library"
                className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
              >
                Health Library
              </Link>
            </li>

            <li className="text-white/90 drop-shadow-md" aria-hidden="true">
              /
            </li>

            <li>
              <Link
                to="/health-library/blogs"
                className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
              >
                Blogs
              </Link>
            </li>

            <li className="text-white/90 drop-shadow-md" aria-hidden="true">
              /
            </li>

            <li
              aria-current="page"
              className="font-bold text-white drop-shadow-md"
            >
              Article
            </li>
          </ol>
        </div>
      </nav>

      {/* ARTICLE CONTENT + SIDEBAR */}
      <section className="page-container grid grid-cols-1 items-start gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,4fr)_minmax(220px,1fr)] lg:gap-8 lg:px-12 lg:py-16">

        {/* LEFT SIDE - ARTICLE */}
        <article className="min-w-0">

          {/* BACK TO BLOGS */}
          <div className="mb-8">
            <Link
              to="/health-library/blogs"
              className="inline-flex items-center gap-2 text-base font-bold text-[#4F7359] transition hover:text-[#A34116]"
            >
              <ArrowLeft size={19} />
              Back to All Blogs
            </Link>
          </div>

          {/* ARTICLE SPECIALITY, READ TIME, DATE & TITLE */}
<header className="mx-auto mb-9 max-w-5xl text-center">

  {/* SPECIALITY, READ TIME & ADDED DATE */}
  <div className="mb-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">

    {/* SPECIALITY */}
  {blog.specialityName && (
    <span className="inline-flex items-center rounded-full bg-[#E8F0EA] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#4F7359]">
      {blog.specialityName}
    </span>
  )}

  {/* READ TIME */}
  {blog.readTime && (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#3D4A40]">
      <Clock3 size={17} className="shrink-0 text-[#A34116]" />
      {blog.readTime}
    </span>
  )}

  {/* ARTICLE ADDED DATE & TIME */}
  {blog.createdAt && (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-[#68766B]">
      <CalendarDays size={17} className="shrink-0 text-[#A34116]" />
      Added on {formatAddedDate(blog.createdAt)}
    </span>
  )}

  </div>

  {/* ARTICLE TITLE */}
  <h1 className="display-font break-words text-3xl font-extrabold leading-tight text-[#243528] sm:text-4xl lg:text-5xl xl:text-[42px]">
    {blog.title}
  </h1>

  {/* ORANGE UNDERLINE */}
  <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#963D16]" />

</header>

          {/* FEATURE IMAGE - BELOW TITLE */}
          {blog.image && (
            <div className="mx-auto mb-10 max-w-5xl overflow-hidden rounded-2xl bg-[#E8F0EA] shadow-lg">
              <img
                src={blog.image}
                alt={blog.title}
                className="h-[240px] w-full object-cover sm:h-[380px] lg:h-[460px]"
              />
            </div>
          )}

          {/* ARTICLE BODY - BELOW IMAGE */}
          <div className="mx-auto max-w-5xl">

            <div
              className="
                break-words text-base leading-7 text-[#3D4A40]
                sm:text-[17px] sm:leading-8
                lg:text-lg lg:leading-8
                [&_p]:mb-4 [&_p]:leading-8
                [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-2xl
                [&_h2]:leading-tight [&_h2]:font-extrabold [&_h2]:text-[#243528]
                [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-xl
                [&_h3]:leading-tight [&_h3]:font-bold [&_h3]:text-[#4F7359]
                [&_strong]:font-bold
                [&_ul]:mb-4 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-7
                [&_ol]:mb-4 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-7
                [&_li]:mb-2 [&_li]:leading-7
                [&_img]:my-5 [&_img]:max-w-full [&_img]:rounded-xl
              "
              dangerouslySetInnerHTML={{
                __html: blog.content || "",
              }}
            />

            {/* MEDICAL DISCLAIMER */}
            <div className="mt-14 rounded-2xl border-l-4 border-[#963D16] bg-[#F6F9F6] p-6 sm:p-9">

              <div className="flex items-center gap-3">
                <BookOpen
                  size={23}
                  className="shrink-0 text-[#4F7359]"
                />

                <h2 className="display-font text-xl font-bold text-[#4F7359] sm:text-2xl">
                  Important Medical Information
                </h2>
              </div>

              <p className="mt-4 text-base leading-8 text-[#3D4A40] sm:text-lg">
                This article is intended for general educational purposes
                only. It does not replace professional medical advice,
                diagnosis or treatment. Please consult your oncologist
                or qualified healthcare professional for advice about
                your individual condition.
              </p>

            </div>

            {/* BACK TO BLOGS BUTTON */}
            <div className="mt-12 border-t border-[#D4E0D6] pt-9 text-center">
              <Link
                to="/health-library/blogs"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#4F7359] px-8 py-3 text-base font-bold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#963D16] hover:shadow-lg"
              >
                <ArrowLeft size={19} />
                Back to All Blogs
              </Link>
            </div>

          </div>
        </article>

        {/* RIGHT SIDE - SIDEBAR */}
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">

          {/* RECENT BLOGS */}
          <section className="rounded-xl border border-[#DCE5DA] bg-[#F6F9F6] p-4 sm:p-5">

            <div className="mb-4 flex items-center gap-2">
              <BookOpen size={20} className="shrink-0 text-[#A34116]" />

              <h2 className="font-display text-lg font-bold text-[#304B3C]">
                Recent Blogs
              </h2>
            </div>

            {sidebarRecentBlogs.length > 0 ? (
              <div className="max-h-[370px] space-y-3 overflow-y-auto overscroll-contain pr-2">

                {sidebarRecentBlogs.map((item) => (
                  <Link
                    key={item.id || item.slug}
                    to={`/health-library/blogs/${item.slug}`}
                    className="group flex min-h-[70px] items-center gap-3 rounded-lg p-1 transition hover:bg-white"
                  >

                    {/* BLOG IMAGE */}
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#E2EBE1]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title || "Blog"}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen
                            size={23}
                            className="text-[#4F7359]"
                          />
                        </div>
                      )}
                    </div>

                    {/* BLOG TITLE */}
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 break-words text-sm font-semibold leading-5 text-[#304B3C] transition group-hover:text-[#A34116]">
                        {item.title}
                      </h3>

                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#718075]">
                        Read Article
                        <ArrowRight size={12} />
                      </span>
                    </div>

                  </Link>
                ))}

              </div>
            ) : (
              <p className="py-4 text-sm text-[#718075]">
                No recent blogs available.
              </p>
            )}

          </section>

         
{/* SPECIALITIES */}
<section className="rounded-xl border border-[#DCE5DA] bg-[#F6F9F6] p-4 sm:p-5">

  <div className="mb-4 flex items-center gap-2">
    <Stethoscope
      size={20}
      className="shrink-0 text-[#A34116]"
    />

    <h2 className="font-display text-lg font-bold text-[#304B3C]">
      Specialities
    </h2>
  </div>

  {specialities.length > 0 ? (
    <div className="max-h-[230px] space-y-1 overflow-y-auto overscroll-contain pr-2">

      {specialities.map((speciality) => {
        const Icon = getSpecialityIcon(speciality.icon_name);

        return (
          <Link
            key={speciality.id}
            to={`/specialities/${speciality.slug}`}
            className="group flex min-h-10 items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-[#414B43] transition hover:bg-white hover:text-[#A34116]"
          >
            {/* BACKEND SPECIALITY ICON */}
            <Icon
              size={17}
              className="shrink-0 text-[#4F7355] transition group-hover:text-[#A34116]"
            />

            {/* SPECIALITY NAME */}
            <span className="min-w-0 flex-1 break-words">
              {speciality.name}
            </span>

            {/* ARROW */}
            <ArrowRight
              size={14}
              className="shrink-0 text-[#9AA89C] opacity-0 transition group-hover:translate-x-1 group-hover:text-[#A34116] group-hover:opacity-100"
            />
          </Link>
        );
      })}

    </div>
  ) : (
    <p className="py-3 text-sm text-[#718075]">
      No specialities available.
    </p>
  )}

</section>

        </aside>

      </section>
    </main>
  );
}














// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";

// import {
//   ArrowLeft,
//   Clock3,
//   BookOpen,
//   CalendarDays,
//   Stethoscope,
//   ArrowRight,
// } from "lucide-react";

// import {
//   getBlogBySlug,
//   getBlogs,
// } from "../api/blogsApi";

// import { getSpecialities } from "../api/specialitiesApi";

// import appointmentsWave from "../assets/appointments-wave.jpg";


// const formatAddedDate = (date) => {
//   if (!date) return "";

//   const parsedDate = new Date(date);

//   if (Number.isNaN(parsedDate.getTime())) return "";

//   return parsedDate.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// export default function HealthLibraryArticlePage() {
//   const { slug } = useParams();

//   const [blog, setBlog] = useState(null);
// const [loading, setLoading] = useState(true);

// const [recentBlogs, setRecentBlogs] = useState([]);
// const [specialities, setSpecialities] = useState([]);

// useEffect(() => {
//   let active = true;

//   const loadBlog = async () => {
//     try {
//       const data = await getBlogBySlug(slug);

//       if (active) setBlog(data);
//     } catch (error) {
//       console.error("Unable to load article:", error);

//       if (active) setBlog(null);
//     } finally {
//       if (active) setLoading(false);
//     }
//   };

//   loadBlog();

//   return () => {
//     active = false;
//   };
// }, [slug]);

// // FETCH RECENT BLOGS
// useEffect(() => {
//   let active = true;

//   const loadRecentBlogs = async () => {
//     try {
//       const data = await getBlogs({});

//       if (active) {
//         const blogList = Array.isArray(data)
//           ? data
//           : data?.rows || data?.data?.rows || data?.data || [];

//         setRecentBlogs(blogList);
//       }
//     } catch (error) {
//       console.error("Unable to load recent blogs:", error);

//       if (active) {
//         setRecentBlogs([]);
//       }
//     }
//   };

//   loadRecentBlogs();

//   return () => {
//     active = false;
//   };
// }, []);

// // FETCH SPECIALITIES
// useEffect(() => {
//   let active = true;

//   const loadSpecialities = async () => {
//     try {
//       const response = await getSpecialities({
//         is_active: 1,
//         limit: 100,
//       });

//       const rows = Array.isArray(response)
//         ? response
//         : response?.rows ||
//           response?.data?.rows ||
//           response?.data ||
//           [];

//       if (active) {
//         setSpecialities(rows);
//       }
//     } catch (error) {
//       console.error("Unable to load specialities:", error);

//       if (active) {
//         setSpecialities([]);
//       }
//     }
//   };

//   loadSpecialities();

//   return () => {
//     active = false;
//   };
// }, []);

// const sidebarRecentBlogs = recentBlogs
//   .filter((item) => item.slug !== slug)
//   .slice(0, 20);

// if (loading) {
//   return (
//     <main className="flex min-h-[65vh] items-center justify-center bg-white">
//       <p className="font-semibold text-[#4F7359]">
//         Loading article...
//       </p>
//     </main>
//   );
// }

//   if (!blog) {
//     return (
//       <main className="flex min-h-[65vh] items-center justify-center bg-white px-5">
//         <div className="text-center">
//           <BookOpen
//             size={52}
//             className="mx-auto text-[#4F7359]"
//           />

//           <h1 className="display-font mt-5 text-3xl font-extrabold text-[#243528]">
//             Article Not Found
//           </h1>

//           <p className="mt-4 text-base text-[#3D4A40]">
//             Sorry, the requested article could not be found.
//           </p>

//           <Link
//             to="/health-library/blogs"
//             className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#4F7359] px-7 py-3 text-base font-bold text-white transition hover:bg-[#963D16]"
//           >
//             <ArrowLeft size={18} />
//             View All Blogs
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-white">

//       {/* BREADCRUMB */}
//       {/* BREADCRUMB */}
// <nav
//   aria-label="Breadcrumb"
//   className="relative w-full overflow-hidden border-b border-[#dce5da] bg-cover bg-center"
//   style={{
//     backgroundImage: `url(${appointmentsWave})`,
//   }}
// >
//   <div className="page-container relative z-10 mx-auto px-5 py-4 sm:px-8 lg:px-12">
//     <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm">
//       <li>
//         <Link
//           to="/"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
//         >
//           Home
//         </Link>
//       </li>

//       <li className="text-white/90 drop-shadow-md" aria-hidden="true">
//         /
//       </li>

//       <li>
//         <Link
//           to="/health-library"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
//         >
//           Health Library
//         </Link>
//       </li>

//       <li className="text-white/90 drop-shadow-md" aria-hidden="true">
//         /
//       </li>

//       <li>
//         <Link
//           to="/health-library/blogs"
//           className="font-semibold text-white drop-shadow-md transition-colors hover:text-[#A34116]"
//         >
//           Blogs
//         </Link>
//       </li>

//       <li className="text-white/90 drop-shadow-md" aria-hidden="true">
//         /
//       </li>

//       <li
//         aria-current="page"
//         className="font-bold text-white drop-shadow-md"
//       >
//         Article
//       </li>
//     </ol>
//   </div>
// </nav>


//       {/* ARTICLE CONTENT */}
//      <section className="page-container grid grid-cols-1 items-start gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,4fr)_minmax(220px,1fr)] lg:gap-8 lg:px-12 lg:py-16">
//   {/* LEFT SIDE - 80% ARTICLE CONTENT */}
//   <article className="min-w-0">

//         {/* BACK TO BLOGS */}
//         <div className="mb-10">
//           <Link
//             to="/health-library/blogs"
//             className="inline-flex items-center gap-2 text-base font-bold text-[#4F7359] transition hover:text-[#A34116]"
//           >
//             <ArrowLeft size={19} />
//             Back to All Blogs
//           </Link>
//         </div>

//         {/* CENTERED ARTICLE HEADING */}
//         <header className="mx-auto mb-12 max-w-5xl text-center">

          
// {/* CATEGORY, SPECIALITY, READ TIME & ADDED DATE */}
// <div className="mb-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">

  // {/* SPECIALITY */}
  // {blog.specialityName && (
  //   <span className="inline-flex items-center rounded-full bg-[#E8F0EA] px-5 py-2 text-sm font-bold uppercase tracking-wider text-[#4F7359]">
  //     {blog.specialityName}
  //   </span>
  // )}

  // {/* READ TIME */}
  // {blog.readTime && (
  //   <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#3D4A40]">
  //     <Clock3 size={17} className="shrink-0 text-[#A34116]" />
  //     {blog.readTime}
  //   </span>
  // )}

  // {/* ARTICLE ADDED DATE & TIME */}
  // {blog.createdAt && (
  //   <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-[#68766B]">
  //     <CalendarDays size={17} className="shrink-0 text-[#A34116]" />
  //     Added on {formatAddedDate(blog.createdAt)}
  //   </span>
  // )}

// </div>


//           {/* TITLE */}
//           <h1 className="display-font text-3xl font-extrabold leading-tight text-[#243528] sm:text-4xl lg:text-5xl xl:text-[52px]">
//             {blog.title}
//           </h1>

//           {/* EXCERPT */}
//           {blog.excerpt && (
//             <p className="mx-auto mt-7 max-w-4xl text-lg leading-9 text-[#3D4A40] sm:text-xl sm:leading-10">
//               {blog.excerpt}
//             </p>
//           )}

//           <div className="mx-auto mt-8 h-1 w-20 rounded-full bg-[#963D16]" />

//         </header>

//         {/* FEATURE IMAGE */}
//         {blog.image && (
//           <div className="mx-auto mb-14 max-w-6xl overflow-hidden rounded-2xl bg-[#E8F0EA] shadow-lg">

//             <img
//               src={blog.image}
//               alt={blog.title}
//               className="h-[280px] w-full object-cover sm:h-[400px] lg:h-[500px]"
//             />

//           </div>
//         )}

//         {/* ARTICLE BODY */}
//         <div className="mx-auto max-w-5xl">
       
// <div
//   className="
//     text-lg leading-7 text-[#3D4A40]
//     [&_p]:mb-3 [&_p]:leading-7
//     [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-2xl
//     [&_h2]:leading-tight [&_h2]:font-extrabold [&_h2]:text-[#243528]
//     [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl
//     [&_h3]:leading-tight [&_h3]:font-bold [&_h3]:text-[#4F7359]
//     [&_strong]:font-bold
//     [&_ul]:mb-3 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-7
//     [&_ol]:mb-3 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:pl-7
//     [&_li]:mb-1 [&_li]:leading-7
//     [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl
//   "
//   dangerouslySetInnerHTML={{
//     __html: blog.content || "",
//   }}
// />

//           {/* MEDICAL DISCLAIMER */}
//           <div className="mt-16 rounded-2xl border-l-4 border-[#963D16] bg-[#F6F9F6] p-6 sm:p-9">

//             <div className="flex items-center gap-3">
//               <BookOpen
//                 size={23}
//                 className="shrink-0 text-[#4F7359]"
//               />

//               <h2 className="display-font text-xl font-bold text-[#4F7359] sm:text-2xl">
//                 Important Medical Information
//               </h2>
//             </div>

//             <p className="mt-4 text-base leading-8 text-[#3D4A40] sm:text-lg">
//               This article is intended for general educational purposes
//               only. It does not replace professional medical advice,
//               diagnosis or treatment. Please consult your oncologist
//               or qualified healthcare professional for advice about
//               your individual condition.
//             </p>

//           </div>

//           {/* BACK TO BLOGS BUTTON */}
//           <div className="mt-12 border-t border-[#D4E0D6] pt-9 text-center">

//             <Link
//               to="/health-library/blogs"
//               className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#4F7359] px-8 py-3 text-base font-bold text-white shadow-md transition duration-300 hover:-translate-y-1 hover:bg-[#963D16] hover:shadow-lg"
//             >
//               <ArrowLeft size={19} />
//               Back to All Blogs
//             </Link>

//           </div>

//         </div>
//               </article>

//       {/* =====================================
//           RIGHT SIDE - 20% SIDEBAR
//       ====================================== */}

//       <aside className="min-w-0 space-y-8">

//         {/* RECENT BLOGS */}

//         <section className="rounded-xl border border-[#DCE5DA] bg-[#F6F9F6] p-4 sm:p-5">

//           <div className="mb-4 flex items-center gap-2">
//             <BookOpen size={20} className="shrink-0 text-[#A34116]" />

//             <h2 className="font-display text-lg font-bold text-[#304B3C]">
//               Recent Blogs
//             </h2>
//           </div>

//           {sidebarRecentBlogs.length > 0 ? (
//             <div className="max-h-[390px] space-y-3 overflow-y-auto pr-2">

//               {sidebarRecentBlogs.map((item) => (
//                 <Link
//                   key={item.id || item.slug}
//                   to={`/health-library/blogs/${item.slug}`}
//                   className="group flex min-h-[70px] items-center gap-3 rounded-lg p-1 transition hover:bg-white"
//                 >

//                   {/* BLOG IMAGE */}

//                   <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#E2EBE1]">

//                     {item.image ? (
//                       <img
//                         src={item.image}
//                         alt={item.title || "Blog"}
//                         className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
//                       />
//                     ) : (
//                       <div className="flex h-full w-full items-center justify-center">
//                         <BookOpen
//                           size={23}
//                           className="text-[#4F7359]"
//                         />
//                       </div>
//                     )}

//                   </div>

//                   {/* BLOG TITLE */}

//                   <div className="min-w-0 flex-1">

//                     <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#304B3C] transition group-hover:text-[#A34116]">
//                       {item.title}
//                     </h3>

//                     <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#718075]">
//                       Read Article
//                       <ArrowRight size={12} />
//                     </span>

//                   </div>

//                 </Link>
//               ))}

//             </div>
//           ) : (
//             <p className="py-4 text-sm text-[#718075]">
//               No recent blogs available.
//             </p>
//           )}

//         </section>


//         {/* SPECIALITIES */}

//         <section className="rounded-xl border border-[#DCE5DA] bg-[#F6F9F6] p-4 sm:p-5">

//           <div className="mb-4 flex items-center gap-2">

//             <Stethoscope
//               size={20}
//               className="shrink-0 text-[#A34116]"
//             />

//             <h2 className="font-display text-lg font-bold text-[#304B3C]">
//               Specialities
//             </h2>

//           </div>

//           {specialities.length > 0 ? (
//             <div className="max-h-[280px] space-y-1 overflow-y-auto pr-2">

//               {specialities.map((speciality) => (
//                 <div
//                   key={speciality.id}
//                   className="flex min-h-10 items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-[#414B43] transition hover:bg-white"
//                 >

//                   <Stethoscope
//                     size={16}
//                     className="shrink-0 text-[#4F7359]"
//                   />

//                   <span className="min-w-0 flex-1 break-words">
//                     {speciality.name}
//                   </span>

//                 </div>
//               ))}

//             </div>
//           ) : (
//             <p className="py-3 text-sm text-[#718075]">
//               No specialities available.
//             </p>
//           )}

//         </section>

//       </aside>

//     </section>
//     </main>
      
//   );
// }









