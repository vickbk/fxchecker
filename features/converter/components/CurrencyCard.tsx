import { Article, Heading, Section } from "@/shared/heading";
import { BiIcon, Flag, SROnly } from "@/shared/utils";
import { SRHidden } from "@/shared/utils/components/SRHidden";
import { randomUUID } from "crypto";

export const CurrencyCard = () => {
  const [id, searchId, popover] = randomUUID().split("-");
  return (
    <Article id={`${id}`}>
      <button
        className={`p-4 rounded-md bg-btn flex gap-2 items-center [anchor-name:--${popover}]`}
        type="button"
        popoverTarget={popover}
      >
        <Flag src="https://flagcdn.com/us.svg" alt="US Flag" /> USD{" "}
        <BiIcon name="caret-down-fill" />
      </button>
      <form
        popover=""
        id={popover}
        aria-live="polite"
        className={`bg-btn inset-auto [position-anchor:--${popover}] [position-area:bottom_span-right] mt-4 p-4 rounded-lg text-foreground`}
      >
        <label className="relative">
          <SROnly>Enter the currency you like</SROnly>{" "}
          <BiIcon name="search absolute left-2 top-[.005em]" />
          <input
            type="text"
            id={searchId}
            placeholder="Search for currencies..."
            className="pl-8 outline outline-card p-2"
          />
        </label>

        <Section>
          <Heading className="flex justify-between border-b py-4 text-foreground-secondary">
            Currencies <span>56</span>
          </Heading>
          <ul className="mt-4">
            <li className="flex gap-2 text-sm text-foreground-secondary items-center">
              <Flag src="https://flagcdn.com/us.svg" alt="" />{" "}
              <SRHidden className="text-lg text-foreground">CDF</SRHidden>{" "}
              Congolese franc
              <BiIcon name="check text-lg ml-auto" />
            </li>
          </ul>
        </Section>
      </form>
    </Article>
  );
};
