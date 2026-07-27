export function AISparkleCurrencyIcon({
  className = "w-5 h-5",
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
      {/* Primary 4-point AI Sparkle */}
      <path
        d="M12 2c.5 3 2.5 5 5.5 5.5-3 .5-5 2.5-5.5 5.5-.5-3-2.5-5-5.5-5.5 3-.5 5-2.5 5.5-5.5Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Secondary Financial Sparkle */}
      <path
        d="M19 14c.3 1.8 1.5 3 3 3.3-1.5.3-2.7 1.5-3 3.3-.3-1.8-1.5-3-3-3.3 1.5-.3 2.7-1.5 3-3.3Z"
        fill="currentColor"
        stroke="none"
      />

      {/* Mini Dollar/Currency Node */}
      <path d="M5 16v5M3 18.5h4" />
    </svg>
  );
}
