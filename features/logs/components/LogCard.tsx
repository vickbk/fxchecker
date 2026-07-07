import { CurrencyCard } from "@/shared/utils";

export const LogCard = () => {
  return (
    <CurrencyCard>
      <time dateTime="2026-07-08">3M</time>
      <dl>
        <dt>USD {"->"} EUR</dt>
        <dd>USD to EUR</dd>
      </dl>
      <dl>
        <dt>1 000 USD 875 EUR</dt>
        <dd>1 000 USD is 875 EUR</dd>
      </dl>
      <button type="button">Delete</button>
    </CurrencyCard>
  );
};
