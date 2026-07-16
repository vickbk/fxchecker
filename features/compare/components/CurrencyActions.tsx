import { BiIcon, SROnly } from "@/shared/utils";
import { ReactNode } from "react";

export const CurrencyActions = ({ children }: { children?: ReactNode }) => {
  return (
    <ul className="flex gap-2">
      <li>
        <button type="button">
          <SROnly> Add to favorite</SROnly>
          <BiIcon name="star" />
        </button>
      </li>
      <li>
        <button type="button">
          <SROnly> Remove from compare</SROnly> <BiIcon name="trash" />
        </button>
        {children}
      </li>
    </ul>
  );
};
