import { BiIcon, SROnly } from "@/shared/utils";
import { ReactNode } from "react";

export const Actions = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="flex gap-4 items-center">
      <span className="text-foreground-secondary text-sm">8 Pairs</span>
      <button
        popoverTarget="add-compare"
        type="button"
        className="bg-card p-2 rounded-lg [anchor-name:--add-compare]"
      >
        <SROnly>Add currency to compare list</SROnly>
        <BiIcon name="plus" />
      </button>
      {children}
      <div
        popover=""
        id="add-compare"
        className="[position-area:bottom_left] [position-try:flip-inline] [position-anchor:--add-compare] inset-auto bg-card text-foreground mt-4"
      >
        filter will be here
      </div>
    </div>
  );
};
