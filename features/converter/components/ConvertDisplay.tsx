"use client";
import { LoadingPlacehoder } from "@/shared/utils";
import { useRate } from "../hooks/useRate";

export const ConvertDisplay = () => {
  const { amount, rate, loading, from, to } = useRate();
  return (
    <dl>
      <dt className="text-4xl font-bold text-lime-500">
        {loading ? (
          <LoadingPlacehoder className="inline px-16 bg-btn mr-2" />
        ) : (
          (rate * amount).toFixed(2)
        )}
      </dt>
      <dd className="sr-only">
        {loading
          ? "loading rate"
          : `${amount} in ${from} is equivalent to ${amount * rate} in ${to}`}
      </dd>
    </dl>
  );
};
