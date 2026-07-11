import { ReactNode } from "react";

export const SummaryCard = ({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-background-secondary p-4 rounded-lg">
      <dt className="uppercase text-foreground-secondary mb-4">{term}</dt>
      <dd className="text-2xl">{children}</dd>
    </div>
  );
};
