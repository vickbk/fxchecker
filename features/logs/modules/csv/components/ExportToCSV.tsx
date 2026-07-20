"use client";
import { BiIcon, SignInInterceptor } from "@/shared/utils";
import { SelectLog } from "../types";
import { handleCSVExport } from "../utils";

export const ExportToCSV = ({
  SignInInterceptor,
  logs,
}: {
  SignInInterceptor: SignInInterceptor;
  logs: SelectLog[];
}) => {
  return (
    <SignInInterceptor
      type="button"
      onClick={() => handleCSVExport(logs)}
      description="Login to download your conversion history as a CSV file."
      className="bg-card text-foreground-secondary p-2 rounded-lg"
    >
      Export to CSV <BiIcon name="folder" />
    </SignInInterceptor>
  );
};
