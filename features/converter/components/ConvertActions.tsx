"use client";
import { BiIcon, LoadingPlacehoder, SROnly } from "@/shared/utils";
import { useRate } from "../hooks/useRate";

export const ConverterActions = () => {
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
            <LoadingPlacehoder className="inline px-8 bg-card mr-2" />
          ) : (
            rate
          )}
          {to}
        </dd>
      </dl>
      <ul className="uppercase flex justify-center items-center flex-wrap gap-4 sm:ml-auto">
        <li>
          <button
            type="button"
            className="uppercase flex w-full gap-2 p-4 bg-lime-500 rounded-lg text-background"
          >
            <BiIcon name="star-fill" />
            <SROnly>Add to </SROnly>favorite
          </button>
        </li>
        <li>
          <button
            type="button"
            className="uppercase flex items-center gap-2 p-4 outline-lime-500 rounded-lg outline truncate "
          >
            <BiIcon name="clock" />
            Log conversion
          </button>
        </li>
      </ul>
    </div>
  );
};
