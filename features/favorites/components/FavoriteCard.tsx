import { Currency } from "@/infra/api/frankfurter";
import { CurrencyCard, SignInInterceptor } from "@/shared/utils";
import { Suspense } from "react";
import { FavoriteData } from "./FavoriteData";
import { FavoriteLink } from "./FavoriteLink";

export const FavoriteCard = async ({
  base,
  quote,
  SignInInterceptor,
}: Record<"base" | "quote", Currency> & {
  SignInInterceptor: SignInInterceptor;
}) => {
  return (
    <CurrencyCard>
      <dl className="">
        <dt>
          <Suspense key={`favorite-${base.code}-${quote.code}`}>
            <FavoriteLink base={base} quote={quote}>
              {base.code} {"->"} {quote.code}{" "}
              <span className="absolute inset-0" />
            </FavoriteLink>
          </Suspense>
        </dt>
        <dd className="sr-only">
          {base.name} to {quote.name}
        </dd>
      </dl>
      <FavoriteData {...{ base, quote, SignInInterceptor }} />
    </CurrencyCard>
  );
};
