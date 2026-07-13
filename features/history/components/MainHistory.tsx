import { Article, Heading } from "@/shared/heading";
import { keyFromSearchQuery } from "@/shared/utils";
import { Suspense } from "react";
import { HistorySearchParams } from "../types";
import { Graph } from "./Graph";
import { GraphSkeleton } from "./skeletons/GraphSkeleton";
import { SummarySkeleton } from "./skeletons/SummarySkeleton";
import { Summary } from "./Summary";

export const MainHistory = async ({
  searchParams,
}: {
  searchParams: Promise<HistorySearchParams>;
}) => {
  const params = await searchParams;
  const key = keyFromSearchQuery(params);

  return (
    <Article className="p-4 flex flex-col sm:flex-row flex-wrap gap-4 justify-between">
      <Heading className="sr-only">Chart history for USD to EUR</Heading>

      <Suspense key={"history-summary-" + key} fallback={<SummarySkeleton />}>
        <Summary {...params} />
      </Suspense>

      <Suspense key={"history-graph-" + key} fallback={<GraphSkeleton />}>
        <Graph {...params} />
      </Suspense>
    </Article>
  );
};
