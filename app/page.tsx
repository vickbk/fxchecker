import {
  HistorySearchParams,
  MainHistory,
  MainHistorySkeleton,
} from "@/features/history";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<HistorySearchParams>;
}) {
  return (
    <Suspense fallback={<MainHistorySkeleton />}>
      <MainHistory searchParams={searchParams} />
    </Suspense>
  );
}
