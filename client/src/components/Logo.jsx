import { Link } from "react-router-dom";
import { HiOutlineNewspaper } from "react-icons/hi2";

function Logo({ h = 6, w = 6, className, showText = true }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <div
        className={`bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0`}
        style={{ width: `${w * 4}px`, height: `${h * 4}px` }}
      >
        <HiOutlineNewspaper
          className="text-white"
          style={{ fontSize: `${Math.min(h, w) * 2.5}px` }}
        />
      </div>

      <span className="text-white font-semibold text-lg tracking-wide whitespace-nowrap">
        NewsOrbit
      </span>
    </Link>
  );
}

export default Logo;
