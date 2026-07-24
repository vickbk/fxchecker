import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ReactNode } from "react";
import { ClearLogs } from "./ClearLogs";

export const Actions = ({
  count,
  SignInInterceptor,
  children,
}: {
  count: number;
  SignInInterceptor: SignInInterceptor;
  children: ReactNode;
}) => {
  return (
    <>
      <p className="text-foreground-secondary">
        {count} Logged <SROnly>Currenc{count > 1 ? "ies" : "y"}</SROnly>
      </p>
      {children}
      <SignInInterceptor
        type="button"
        popoverTarget="clear-logs"
        description="Login to manage and purge your calculation history."
        className="bg-card text-foreground-secondary p-2 rounded-lg hover:outline hover:outline-foreground-secondary"
      >
        <SROnly>Clear All logs</SROnly> <BiIcon name="trash" />
      </SignInInterceptor>
      <ClearLogs />
    </>
  );
};
