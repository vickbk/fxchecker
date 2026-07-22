import { Currency } from "@/infra/api/frankfurter";
import { FrankfurterRate } from "@/infra/api/frankfurter/types";
import { SignInInterceptor } from "@/shared/utils";
import { ReactNode } from "react";

export type CompareSearchParams = { from?: string; amount?: number };

export type CompareItemProps = FrankfurterRate & {
  amount: number;
  details: { [x: string]: Currency };
  searchQuery: string;
  LoginTrigger: SignInInterceptor;
  children: ReactNode;
};
