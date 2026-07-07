import { Heading } from "@/shared/heading";
import { randomUUID } from "crypto";

export const CurrencyCard = () => {
  const [id, searchId] = randomUUID().split("-");
  return (
    <div role="combobox" aria-controls={`${id}`} aria-expanded={false}>
      <button type="button" id={id}>
        USD
      </button>
      <article aria-live="polite">
        <Heading>Pick a currency</Heading>
        <label htmlFor={searchId}>Enter the currency you like</label>
        <input type="text" id={searchId} placeholder="Eg. USD" />
        <ul>
          <li>CDF</li>
        </ul>
      </article>
    </div>
  );
};
