import { Currency, getRate } from "@/infra/api/frankfurter";
import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { toggleFavorite } from "../actions";

export const FavoriteData = async ({
  base,
  quote,
  SignInInterceptor,
}: Record<"base" | "quote", Currency> & {
  SignInInterceptor: SignInInterceptor;
}) => {
  const { rate, change } = await getRate(base.code, quote.code);

  const increasing = change! > 0;
  const ratePercentage = (((change ?? 0) * 100) / rate).toFixed(4);

  const removeAction = toggleFavorite.bind(null, {
    base: base.code,
    quote: quote.code,
  });

  return (
    <>
      <dl className="ml-auto text-right">
        <dt>{rate}</dt>
        <dd
          className={`${increasing ? "text-green-500" : "text-red-500"} text-xs`}
        >
          <BiIcon name={`caret-${increasing ? "up" : "down"}-fill`} />{" "}
          {increasing ? "+" : ""}
          {ratePercentage}
          <SROnly>{`from currency ${base.name} to currency ${quote.name} the exchange rate is ${rate}.${change ? ` This is ${ratePercentage}% ${increasing ? "more" : "less"} than last week` : ""}`}</SROnly>
        </dd>
      </dl>
      <form className="z-1" action={removeAction as (form: FormData) => void}>
        <SignInInterceptor
          className="p-2 rounded-lg border border-lime-500 action-btn hover:bg-lime-500/10"
          type="submit"
        >
          <SROnly>Remove from favorite</SROnly>
          <BiIcon name="star-fill text-lime-500" />
        </SignInInterceptor>
      </form>
    </>
  );
};
