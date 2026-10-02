import React from "react";

interface InstagramVerifiedBadgeProps {
  className?: string;
  title?: string;
  size?: number;
}

/**
 * Authentic Instagram-style scalloped verified blue badge with a crisp white checkmark.
 */
export const InstagramVerifiedBadge: React.FC<InstagramVerifiedBadgeProps> = ({
  className = "w-4 h-4",
  title = "Verified Mandapam Organizer",
  size
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 align-middle text-[#0095F6] ${className}`}
      style={size ? { width: size, height: size } : undefined}
      title={title}
      aria-label={title}
    >
      {/* Official Instagram Scalloped Blue Rosette with embedded checkmark */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.138 3.713 4 5.622 4 8c0 .173.012.347.035.521C2.802 9.214 2 10.534 2 12s.802 2.786 2.035 3.479C4.012 15.653 4 15.827 4 16c0 2.378 2.138 4.287 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.287 20 18.378 20 16c0-.173-.012-.347-.035-.521C21.198 14.786 22 13.466 22 12s-.802-2.786-2.035-3.479zm-9.01 7.895l-3.667-3.714 1.424-1.404 2.257 2.286 5.894-5.753 1.41 1.418-7.318 7.167z"
        fill="#0095F6"
      />
    </svg>
  );
};
