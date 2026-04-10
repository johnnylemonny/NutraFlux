export function LogoMark({ className = 'size-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="macroflow-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--tone-strong)" />
          <stop offset="1" stopColor="var(--tone-strong)" stopOpacity="0.7" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Ring - Progress Background */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-10"
      />

      {/* Active Flow Path */}
      <path
        d="M32 4C39.4239 4 46.5436 6.95001 51.799 12.2054C57.0544 17.4607 60.0044 24.5804 60.0044 32.0044C60.0044 39.4284 57.0544 46.548 51.799 51.8034"
        stroke="url(#macroflow-gradient)"
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#logo-glow)"
      />

      {/* Styled 'M' Character */}
      <path
        d="M20 44V24L32 36L44 24V44"
        stroke="url(#macroflow-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logo-glow)"
      />

      {/* Accent Dot */}
      <circle cx="51.799" cy="51.8034" r="3.5" fill="var(--tone-strong)" />
    </svg>
  )
}
