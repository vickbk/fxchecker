import { SummaryCard } from "./SummaryCard";

export const Summary = () => {
  return (
    <dl className="grid grid-cols-2 gap-4">
      <SummaryCard term="Open">0.8500</SummaryCard>
      <SummaryCard term="Close">0.8503</SummaryCard>
      <SummaryCard term="Change">
        <span className="text-green-500">
          <span className="sr-only">Rate raised with</span> +0.0003
        </span>
      </SummaryCard>
      <SummaryCard term="% Change">
        <span className="text-red-500">
          <span className="sr-only">Drop percentage</span>
          <i className="bi bi-caret-up-fill" /> 0.0003
        </span>
      </SummaryCard>
    </dl>
  );
};
