import * as React from "react";

export function ZephrLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width || "32"}
      height={props.height || "32"}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient
          id="zephrLogoGradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="50%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      
      {/* Left Face - Prism */}
      <path
        d="M16 3L3 9.5V22.5L16 29V16L16 3Z"
        fill="url(#zephrLogoGradient)"
        opacity="0.65"
      />
      {/* Right Face - Prism */}
      <path
        d="M16 3L29 9.5V22.5L16 29V16L16 3Z"
        fill="url(#zephrLogoGradient)"
      />
      {/* Top Face - Prism */}
      <path
        d="M3 9.5L16 3L29 9.5L16 16L3 9.5Z"
        fill="#ffffff"
        opacity="0.3"
      />
    </svg>
  );
}
