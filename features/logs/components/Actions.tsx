import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ClearLogs } from "./ClearLogs";
import { ExportToCSV } from "./ExportToCSV";

export const Actions = ({
  count,
  SignInInterceptor,
}: {
  count: number;
  SignInInterceptor: SignInInterceptor;
}) => {
  return (
    <>
      <p className="text-foreground-secondary">
        {count} Logged <SROnly>Currenc{count > 1 ? "ies" : "y"}</SROnly>
      </p>
      <ExportToCSV SignInInterceptor={SignInInterceptor} />
      <SignInInterceptor
        type="button"
        popoverTarget="clear-logs"
        className="bg-card text-foreground-secondary p-2 rounded-lg"
      >
        <SROnly>Clear All</SROnly> <BiIcon name="trash" />
      </SignInInterceptor>
      <ClearLogs />
    </>
  );
};
