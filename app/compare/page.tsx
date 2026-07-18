import { SignInInterceptor } from "@/features/account";
import { CompareSearchParams, MainCompare } from "@/features/compare";
import { MainCompareSkeleton } from "@/features/compare/components/skeletons/MainCompareSkeleton";
import { keyFromSearchQuery } from "@/shared/utils";
import { Suspense } from "react";

export default async function Compare({
  searchParams,
}: {
  searchParams: Promise<CompareSearchParams>;
}) {
  const params = await searchParams;
  return (
    <Suspense
      key={keyFromSearchQuery(params, "from", "amount")}
      fallback={<MainCompareSkeleton />}
    >
      <MainCompare LoginTrigger={SignInInterceptor} {...params} />
    </Suspense>
  );
}
