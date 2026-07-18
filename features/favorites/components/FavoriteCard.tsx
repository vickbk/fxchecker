import { FavoriteEntry } from "@/shared/currencies";
import { BiIcon, CurrencyCard, SROnly } from "@/shared/utils";

export const FavoriteCard = ({ favorite }: { favorite: FavoriteEntry }) => {
  const [base, quote] = favorite.split("-");

  return (
    <CurrencyCard>
      <dl className="">
        <dt className="truncate">
          {base} {"->"} {quote}
        </dt>
        <dd className="sr-only">British Pound to Euro</dd>
      </dl>
      <dl className="ml-auto">
        <dt>0.8990</dt>
        <dd className="text-red-500">
          <BiIcon name="caret-up-fill" /> +16%
        </dd>
      </dl>
      <label className="p-2 rounded-lg border border-lime-500">
        <SROnly>
          Remove from favorite <input type="checkbox" />
        </SROnly>
        <BiIcon name="star-fill text-lime-500" />
      </label>
    </CurrencyCard>
  );
};
