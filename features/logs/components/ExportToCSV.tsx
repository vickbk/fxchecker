"use client";
import { BiIcon, SignInInterceptor } from "@/shared/utils";

export const ExportToCSV = ({
  SignInInterceptor,
}: {
  SignInInterceptor: SignInInterceptor;
}) => {
  return (
    <SignInInterceptor
      type="button"
      className="bg-card text-foreground-secondary p-2 rounded-lg"
    >
      Export to CSV <BiIcon name="folder" />
    </SignInInterceptor>
  );
};
