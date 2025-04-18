"use client";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 select-none"
    >
      {/* interlocking link icon (Lucide) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="h-12 w-12 stroke-current text-blue-800"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
        />
      </svg>

      {/* text + slogan */}
      <div className="flex flex-col leading-tight">
        <span className="md:text-2xl font-extrabold bg-gradient-to-r from-blue-800 to-emerald-600 bg-clip-text text-transparent font-montserrat">
          TCCLink
        </span>
        <span className="text-sm text-gray-500">
          Connect. Collaborate. Complete.
        </span>
      </div>
    </Link>
  );
}
