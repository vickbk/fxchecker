import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ReactNode } from "react";

export const Actions = ({
  LoginTrigger: LoginTrigger,
}: {
  children?: ReactNode;
  LoginTrigger: SignInInterceptor;
}) => {
  return (
    <div className="flex gap-4 items-center">
      <span className="text-foreground-secondary text-sm">8 Pairs</span>

      <LoginTrigger
        popoverTarget="add-compare"
        className="bg-card p-2 rounded-lg [anchor-name:--add-compare]"
        description="Login to use the add currency to compare list feature and many more options."
      >
        <SROnly>Add currency to compare list</SROnly>
        <BiIcon name="plus" />
      </LoginTrigger>
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
