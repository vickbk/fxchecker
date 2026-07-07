import { CurrencyCard } from "@/shared/utils";

export const FavoriteCard = () => {
  return (
    <CurrencyCard>
      <dl>
        <dt>GBP {"->"} EUR</dt>
        <dd>British Pound to Euro</dd>
      </dl>
      <dl>
        <dt>0.8990</dt>
        <dd>^+16%</dd>
      </dl>
      <label>
        Remove from favorite
        <input type="checkbox" />
      </label>
    </CurrencyCard>
  );
};
