import { Currency } from "@/infra/api/frankfurter";
import { Flag } from "@/shared/currencies";
import { Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";
import { Fragment } from "react/jsx-runtime";

export const CurrencyGroup = ({
  currencies,
  filtered,
  title,
}: {
  filtered: Set<string>;
  currencies: Currency[];
  title: string;
}) => {
  const len = currencies.filter(({ code }) => filtered.has(code)).length;
  return (
    <>
      <Heading className="sticky top-1 py-4 uppercase text-left bg-card">
        {title} ({len})
      </Heading>

      {currencies.map(({ code, symbol, name }) => (
        <Fragment key={code}>
          <input
            type="checkbox"
            name="currency"
            value={code}
            id={`add-currency-${code}`}
            className={`add-compare__option`}
          />
          <label
            className={`add-compare__option-label ${!filtered.has(code) ? "hidden" : "flex"}`}
            htmlFor={`add-currency-${code}`}
          >
            <Flag currency={code} alt="" />
            <span className="grid gap mr-auto">
              {code} ({symbol}){" "}
              <span className="text-foreground-secondary truncate max-w-50 text-sm">
                {name}
              </span>{" "}
            </span>
            <BiIcon name="check add-compare__check" />
          </label>
        </Fragment>
      ))}
    </>
  );
};
