"use client";

import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { useFormStatus } from "react-dom";

export const LogDelete = ({
  SignInInterceptor,
}: {
  SignInInterceptor: SignInInterceptor;
}) => {
  const { pending } = useFormStatus();
  return (
    <SignInInterceptor
      type="submit"
      disabled={pending}
      className="bg-background-secondary text-foreground-secondary p-2 rounded-lg"
    >
      <SROnly>{pending ? "Deleting..." : "Delete Log"}</SROnly>
      <BiIcon
        name={pending ? "arrow-repeat inline-block animate-spin" : "trash"}
      />
    </SignInInterceptor>
  );
};
