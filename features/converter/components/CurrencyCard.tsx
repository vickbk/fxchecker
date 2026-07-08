import { Article, Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";
import { randomUUID } from "crypto";
import Image from "next/image";

export const CurrencyCard = () => {
  const [id, searchId] = randomUUID().split("-");
  return (
    <Article role="combobox" aria-controls={`${id}`} aria-expanded={false}>
      <button
        className="p-4 rounded-md bg-btn flex gap-2 items-center"
        type="button"
        id={id}
      >
        <Image
          src="https://flagcdn.com/us.svg"
          alt="US Flag"
          width={25}
          height={25}
          className="rounded-full aspect-square"
        />{" "}
        USD <BiIcon name="caret-down-fill" />
      </button>
      <dialog aria-live="polite">
        <Heading>Pick a currency</Heading>
        <label htmlFor={searchId}>Enter the currency you like</label>
        <input type="text" id={searchId} placeholder="Eg. USD" />
        <ul>
          <li>CDF</li>
        </ul>
      </dialog>
    </Article>
  );
};
