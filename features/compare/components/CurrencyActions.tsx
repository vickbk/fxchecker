import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ReactNode } from "react";

export const CurrencyActions = ({
  LoginTrigger,
  children,
  quote,
  favoriteWrapper,
}: {
  LoginTrigger: SignInInterceptor;
  children: ReactNode;
  quote: string;
  favoriteWrapper: ReactNode;
}) => {
  return (
    <ul className="flex gap-2 text-foreground-secondary z-1">
      <li className="text-lime-500">{favoriteWrapper}</li>
      <li>
        <LoginTrigger
          className={`[anchor-name:--delete${quote}] action-btn`}
          popoverTarget={"delete-" + quote}
          description="Login to use the remove currency from compare list feature and many more options."
        >
          <SROnly> Remove from compare</SROnly> <BiIcon name="trash" />
        </LoginTrigger>
        {children}
      </li>
    </ul>
  );
};
