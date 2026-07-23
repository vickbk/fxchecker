import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ReactNode } from "react";
import { addToCompareCurrencies } from "../actions";
import { AddDialog } from "../modules/add";

export const Actions = ({
  LoginTrigger: LoginTrigger,
  rates,
}: {
  children?: ReactNode;
  rates: string[];
  LoginTrigger: SignInInterceptor;
}) => {
  const count = rates.length;
  return (
    <div className="flex gap-4 items-center">
      <span className="text-foreground-secondary text-sm">
        {count} Pair{count > 1 ? "s" : ""}
      </span>

      <LoginTrigger
        popoverTarget="add-compare-dialog"
        className="bg-card p-2 rounded-lg [anchor-name:--add-compare] action-btn hover:outline hover:outline-foreground-secondary"
        description="Login to use the add currency to compare list feature and many more options."
      >
        <SROnly>Add currency to compare list</SROnly>
        <BiIcon name="plus" />
      </LoginTrigger>
      <AddDialog action={addToCompareCurrencies} />
    </div>
  );
};
