import { Article, Heading } from "@/shared/heading";
import { Suspense } from "react";
import { HistorySearchParams } from "../types";
import { Graph } from "./Graph";
import { Menue } from "./Menue";
import { SummarySkeleton } from "./skeletons/SummarySkeleton";
import { Summary } from "./Summary";

export const MainHistory = async ({
  searchParams,
}: {
  searchParams: Promise<HistorySearchParams>;
}) => {
  const params = await searchParams;
  return (
    <Article className="p-4 flex flex-col sm:flex-row flex-wrap gap-4 justify-between">
      <Heading className="sr-only">Chart history for USD to EUR</Heading>

      <Suspense fallback={<SummarySkeleton />}>
        <Summary {...params} />
      </Suspense>
      <Menue {...params} />
      <Suspense>
        <Graph {...params} />
      </Suspense>
    </Article>
  );
};
