"use client";
import { exLogs } from "@/features/logs/db/schema";
import { BiIcon, SignInInterceptor } from "@/shared/utils";

export const ExportToCSV = ({
  SignInInterceptor,
  logs,
}: {
  SignInInterceptor: SignInInterceptor;
  logs: (typeof exLogs.$inferSelect)[];
}) => {
  return (
    <SignInInterceptor
      type="button"
      onClick={() => console.log(logs)}
      description="Login to download your conversion history as a CSV file."
      className="bg-card text-foreground-secondary p-2 rounded-lg"
    >
      Export to CSV <BiIcon name="folder" />
    </SignInInterceptor>
  );
};
