
// import { Link } from "react-router-dom";
// import { ArrowUpRight } from "lucide-react";

// export default function ServiceCard({ service, index = 0 }) {
//   return (
//     <article
//       className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
//       style={{ animationDelay: `${index * 80}ms` }}
//     >
//       {/* Service Image */}
//       <div className="relative h-52 overflow-hidden bg-mist sm:h-56">
//         <img
//           src={service.image}
//           alt={service.title}
//           loading="lazy"
//           className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
//         />
//       </div>

//       {/* Heading and Description */}
//       <div className="flex flex-1 flex-col p-5 sm:p-6">
//         <h3 className="text-xl font-semibold leading-snug text-heading">
//           {service.title}
//         </h3>

//         <p className="mt-3 flex-1 text-[15px] leading-7 text-ink">
//           {service.description}
//         </p>

//         {/* Read More */}
//         <Link
//           to={service.path}
//           className="mt-5 inline-flex w-fit items-center gap-2 text-[15px] font-semibold text-royal transition-colors hover:opacity-75"
//         >
//           Learn More
//           <ArrowUpRight
//             size={18}
//             className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
//           />
//         </Link>
//       </div>
//     </article>
//   );
// }


