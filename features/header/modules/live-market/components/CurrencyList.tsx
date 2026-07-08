import { Rate } from "@/infra/api/frankfurter/types";
import { BiIcon } from "@/shared/utils";

export const CurrencyList = ({
  duplicate = false,
  rates,
}: {
  duplicate?: boolean;
  rates: Rate[];
}) => {
  return (
    <ul className="flex" aria-hidden={duplicate}>
      {rates.map((rate, index) => {
        const isGoingUp = rate.change && rate.change >= 0;
        return (
          <li
            key={index}
            className="flex items-center justify-between px-4 gap-4 border-foreground-secondary border-x"
          >
            <span className="font-medium text-foreground-secondary">
              {rate.base}/{rate.quote}
            </span>
            <span className="font-bold"> {rate.rate.toFixed(2)}</span>
            {rate.change !== undefined && (
              <span
                className={`flex ${isGoingUp ? "text-green-500" : "text-red-500"}`}
              >
                <BiIcon name={`caret-${isGoingUp ? "up" : "down"}-fill`} />
                {isGoingUp ? "+" : ""}
                {rate.change.toFixed(2)}%
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
