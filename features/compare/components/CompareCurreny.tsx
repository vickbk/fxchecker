import { CurrencyCard, SignInInterceptor } from "@/shared/utils";
import { Flag } from "@/shared/utils/components/Flag";
import { CurrencyActions } from "./CurrencyActions";

export const CompareCurreny = ({
  LoginTrigger,
}: {
  LoginTrigger: SignInInterceptor;
}) => {
  return (
    <CurrencyCard>
      <Flag src="https://flagcdn.com/de.svg" alt="DRC flag" />
      <dl>
        <dt className="text-sm">GBP</dt>
        <dd className="text-foreground-secondary truncate text-xs">
          British Pound
        </dd>
      </dl>
      <dl className="ml-auto">
        <dt>765.43</dt>
        <dd className="text-foreground-secondary text-xs truncate">@ 0.7654</dd>
      </dl>

      <CurrencyActions LoginTrigger={LoginTrigger} />
    </CurrencyCard>
  );
};
