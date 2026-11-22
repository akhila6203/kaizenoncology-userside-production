
import { Link } from "react-router-dom";
import { hospital } from "../data/siteData";

export default function BrandLogo({
  onClick,
  compact = false,
  logo,
}) {
  return (
    <Link
      to="/"
      aria-label={`${hospital.name} ${hospital.nameLine2} - Home`}
      className="flex min-w-0 shrink-0 items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963D16]"
      onClick={onClick}
    >
      <img
        src={logo || "/logo2.jpg"}
        alt={`${hospital.name} ${hospital.nameLine2}`}
        className={`w-auto object-contain ${
          compact ? "h-14" : "h-14 sm:h-16"
        }`}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/logo2.jpg";
        }}
      />

      <span className="min-w-0 sr-only">
        <span>{hospital.name}</span>
        <span>{hospital.nameLine2}</span>
        <span>{hospital.tagline}</span>
      </span>
    </Link>
  );
}













// import { Link } from "react-router-dom";
// import { hospital } from "../data/siteData";

// export default function BrandLogo({ onClick, compact = false }) {
//   return (
//     <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2.5" onClick={onClick}>
//       <img
//         src="/logo2.jpg"
//         alt={`${hospital.name} ${hospital.nameLine2}`}
//         // className={`w-auto object-contain ${compact ? "h-10" : "h-12 sm:h-[3.25rem]"}`}
//         className={`w-auto object-contain ${compact ? "h-14" : "h-14 sm:h-16"}`}
//       />
//       <span className="min-w-0 sr-only">
//         <span>{hospital.name}</span>
//         <span>{hospital.nameLine2}</span>
//         <span>{hospital.tagline}</span>
//       </span>
//     </Link>
//   );
// }
