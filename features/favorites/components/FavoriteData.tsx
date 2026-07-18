import { Currency, getRate } from "@/infra/api/frankfurter";
import { BiIcon, SROnly } from "@/shared/utils";

export const FavoriteData = async ({
  base,
  quote,
}: Record<"base" | "quote", Currency>) => {
  const { rate, change } = await getRate(base.code, quote.code);

  const increasing = change! > 0;
  const ratePercentage = (((change ?? 0) * 100) / rate).toFixed(4);

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
      <label className="p-2 rounded-lg border border-lime-500">
        <SROnly>
          Remove from favorite <input type="checkbox" />
        </SROnly>
        <BiIcon name="star-fill text-lime-500" />
      </label>
    </>
  );
};
