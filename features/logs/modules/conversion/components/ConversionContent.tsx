"use client";

import { BiIcon, SignInInterceptor } from "@/shared/utils";
import { useConversion } from "../hooks";

export const ConversionContent = ({
  SignInInterceptor,
}: {
  SignInInterceptor: SignInInterceptor;
}) => {
  const { from, to, amount, rate, loading, pending } = useConversion();

  return (
    <>
      {(
        [
          ["base", from],
          ["quote", to],
          ["rate", rate ?? 0],
          ["amount", amount],
        ] as const
      ).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <SignInInterceptor
        className="uppercase flex items-center gap-2 p-4 outline-lime-500 rounded-lg outline truncate"
        type="submit"
        disabled={pending || loading}
        description="Login to log the current calculation history."
      >
        <BiIcon name="clock" />
        {!pending ? (
          "Log conversion"
        ) : (
          <>
            Logging... <BiIcon name="arrow animate-spin inline-block" />
          </>
        )}
      </SignInInterceptor>
    </>
  );
};
