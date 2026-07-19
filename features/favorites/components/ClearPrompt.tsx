import { Currency } from "@/infra/api/frankfurter";
import { Heading } from "@/shared/heading";
import {
  BiIcon,
  Flag,
  getCurrencyCountry,
  LoadingSubmit,
} from "@/shared/utils";
import { clearAllFavorites } from "../actions";

export const ClearPrompt = async ({
  favorites,
}: {
  favorites: Record<"base" | "quote", Currency>[];
}) => {
  return (
    <form
      action={clearAllFavorites as () => void}
      popover=""
      id="clear-favorite-prompt"
      className="[position-area:bottom_span-left] p-4 rounded-lg bg-card text-center open:grid gap-4 max-w-xs"
    >
      <Heading className="uppercase font-bold text-xl text-lime-500">
        Clearing favorites
      </Heading>
      <p>Are you sure you want to clear all your favorite pairs?</p>
      <dl className="grid gap-2">
        {favorites.map(({ base, quote }) => (
          <div key={"clear-" + base.code + quote.code}>
            <dt className="flex gap-2 items-center justify-center">
              <Flag country={getCurrencyCountry(base.code)} alt="" />
              {base.code} <BiIcon name="arrow-right" />{" "}
              <Flag country={getCurrencyCountry(quote.code)} alt="" />
              {quote.code}
            </dt>
            <dd className="sr-only">{`Delete exhange pair From ${base.code} to ${quote.code}`}</dd>
          </div>
        ))}
      </dl>
      <div className="flex justify-center gap-4">
        <LoadingSubmit
          text="Clearing"
          className="bg-lime-500 text-background p-2 rounded-lg"
        >
          <BiIcon name="trash" /> Clear
        </LoadingSubmit>
        <button type="button" popoverTarget="clear-favorite-prompt">
          Cancel
        </button>
      </div>
    </form>
  );
};
