"use client";
import { LoadingPlaceholder } from "@/shared/utils";
import { ReactNode } from "react";
import { useRate } from "../hooks/useRate";

export const ConverterActions = ({ children }: { children: ReactNode }) => {
  const { from, to, rate, loading } = useRate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row items-center p-4 border-t border-dashed border-card text-center uppercase">
      <dl>
        <dt className="sr-only">
          Current rate for {from} to {to}
        </dt>
        <dd>
          1{from} ={" "}
          {loading ? (
            <LoadingPlaceholder className="inline px-8 bg-card mr-2" />
          ) : (
            rate
          )}
          {to}
        </dd>
      </dl>
      {children}
    </div>
  );
};
