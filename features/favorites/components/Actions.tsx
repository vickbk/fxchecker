import { Currency } from "@/infra/api/frankfurter";
import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { ClearPrompt } from "./ClearPrompt";

export const Actions = ({
  favorites,
  SignInInterceptor,
}: {
  favorites: Record<"base" | "quote", Currency>[];
  SignInInterceptor: SignInInterceptor;
}) => {
  const count = favorites.length;
  return (
    <>
      <dl className="ml-auto">
        <dt className="sr-only">Total Count</dt>
        <dd className="uppercase">
          {count} Favorite{count > 1 ? "s" : ""}
        </dd>
      </dl>
      <SignInInterceptor
        popoverTarget="clear-favorite-prompt"
        className="p-2 bg-card rounded-lg"
      >
        <SROnly>Clear all favorites</SROnly>
        <BiIcon name="trash" />
      </SignInInterceptor>
      <ClearPrompt favorites={favorites} />
    </>
  );
};
