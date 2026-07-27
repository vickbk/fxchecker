import { SROnly } from "@/shared/utils";
import { ReactNode } from "react";

export const SummaryCard = ({
  term,
  children,
  sronly,
}: {
  term: string;
  sronly?: string;
  children: ReactNode;
}) => {
  return (
    <div className="bg-background-secondary p-4 rounded-lg">
      <dt className="uppercase text-foreground-secondary mb-4">
        {term} {sronly && <SROnly>{sronly}</SROnly>}
      </dt>
      <dd className="text-2xl">{children}</dd>
    </div>
  );
};
