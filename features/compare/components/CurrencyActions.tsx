import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ReactNode } from "react";

export const CurrencyActions = ({
  LoginTrigger,
  children,
  quote,
}: {
  LoginTrigger: SignInInterceptor;
  children: ReactNode;
  quote: string;
}) => {
  return (
    <ul className="flex gap-2 text-foreground-secondary z-1">
      <li>
        <LoginTrigger description="Login to use the add currency to favorite feature and many more options">
          <SROnly> Add to favorite</SROnly>
          <BiIcon name="star" />
        </LoginTrigger>
      </li>
      <li>
        <LoginTrigger
          className={`[anchor-name:--delete${quote}]`}
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
