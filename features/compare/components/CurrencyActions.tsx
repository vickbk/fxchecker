import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";

export const CurrencyActions = ({
  LoginTrigger,
}: {
  LoginTrigger: SignInInterceptor;
}) => {
  return (
    <ul className="flex gap-2 text-foreground-secondary">
      <li>
        <LoginTrigger description="Login to use the add currency to favorite feature and many more options">
          <SROnly> Add to favorite</SROnly>
          <BiIcon name="star" />
        </LoginTrigger>
      </li>
      <li>
        <LoginTrigger description="Login to use the remove currency from compare list feature and many more options.">
          <SROnly> Remove from compare</SROnly> <BiIcon name="trash" />
        </LoginTrigger>
      </li>
    </ul>
  );
};
