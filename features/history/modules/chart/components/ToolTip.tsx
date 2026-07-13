import { TooltipProps } from "../types";

export const CustomToolTip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload || payload.length === 0) return null;

  const [{ payload: currentData }] = payload;

  const formattedRate = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(currentData.rate);

  return (
    <dl className="rounded-md bg-card p-2 shadow-md border border-card text-xs">
      <dt className="sr-only">Date</dt>
      <dd className="font-medium text-foreground">
        <time dateTime={currentData.date}>{currentData.date}</time>
      </dd>
      <dt className="sr-only">Rate</dt>
      <dd className="text-primary font-semibold mt-0.5">{formattedRate}</dd>
    </dl>
  );
};
