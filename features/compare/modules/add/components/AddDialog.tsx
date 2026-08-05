"use client";
import { LoadingPlaceholder } from "@/shared/utils";
import { ReactNode, useState } from "react";

export const AddDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      popover=""
      onToggle={(e) => setOpen(e.newState === "open")}
      id="add-compare-dialog"
      className="add-compare"
    >
      {open ? (
        children
      ) : (
        <LoadingPlaceholder className="max-w-full w-xs min-h-100" />
      )}
    </div>
  );
};
