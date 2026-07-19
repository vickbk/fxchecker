import { SignInInterceptor } from "@/features/account";
import { MainLogs, MainLogsSkeleton } from "@/features/logs";
import { getRandomInt } from "@/shared/random";
import { Suspense } from "react";

async function Logs(params: { searchParams: Promise<Record<string, string>> }) {
  return (
    <Suspense key={getRandomInt(0, 1000)} fallback={<MainLogsSkeleton />}>
      <MainLogs {...{ ...params, SignInInterceptor }} />
    </Suspense>
  );
}

export default Logs;
