import { Currency } from "@/infra/api/frankfurter";
import { CurrencyCard } from "@/shared/utils";
import { FavoriteData } from "./FavoriteData";
import { FavoriteLink } from "./FavoriteLink";

export const FavoriteCard = async ({
  base,
  quote,
}: Record<"base" | "quote", Currency>) => {
  return (
    <CurrencyCard>
      <dl className="">
        <dt>
          <FavoriteLink base={base} quote={quote}>
            {base.code} {"->"} {quote.code}{" "}
            <span className="absolute inset-0" />
          </FavoriteLink>
        </dt>
        <dd className="sr-only">
          {base.name} to {quote.name}
        </dd>
      </dl>
      <FavoriteData />
    </CurrencyCard>
  );
};
