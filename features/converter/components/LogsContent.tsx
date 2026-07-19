"use client";

import { BiIcon, SignInInterceptor } from "@/shared/utils";
import { useFormStatus } from "react-dom";
import { useRate } from "../hooks/useRate";

export const LogsContent = ({
  SignInInterceptor,
}: {
  SignInInterceptor: SignInInterceptor;
}) => {
  const { from, to, rate, amount } = useRate();
  const { pending } = useFormStatus();
  return (
    <>
      {(
        [
          ["base", from],
          ["quote", to],
          ["rate", rate],
          ["amount", amount],
        ] as const
      ).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <SignInInterceptor
        className="uppercase flex items-center gap-2 p-4 outline-lime-500 rounded-lg outline truncate"
        type="submit"
        disabled={pending}
        description="Login to save this currency pair to your personalized favorites list."
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
