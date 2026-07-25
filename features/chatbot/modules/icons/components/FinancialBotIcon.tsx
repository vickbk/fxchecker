export function FinancialBotIcon({
  className = "w-6 h-6",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Sparkle Antenna */}
      <path d="M12 2v3" />
      <path
        d="M12 2l.75 1.25L14 3.5l-1.25.75L12 5.5l-.75-1.25L10 3.5l1.25-.25Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Bot Head */}
      <rect x="3" y="7" width="18" height="14" rx="4" />

      {/* Digital Eyes */}
      <circle cx="8.5" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="12" r="1.25" fill="currentColor" stroke="none" />

      {/* Financial Trend Smile */}
      <path d="M8 17.8l2.5-1.2 2 1.2 3.5-1.8" />

      {/* Ear Connectors */}
      <path d="M1 11h2M21 11h2" />
    </svg>
  );
}
