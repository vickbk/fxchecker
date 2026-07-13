import { FrankfurterRate } from "@/infra/api/frankfurter/types";

export type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: FrankfurterRate;
  }>;
};
