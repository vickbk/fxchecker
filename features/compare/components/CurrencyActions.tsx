import { BiIcon, SROnly } from "@/shared/utils";

export const CurrencyActions = () => {
  return (
    <ul className="flex gap-2">
      <li>
        <button type="button">
          <SROnly> Add to favorite</SROnly>
          <BiIcon name="star" />
        </button>
      </li>
      <li>
        <button type="button">
          <SROnly> Remove from compare</SROnly> <BiIcon name="trash" />
        </button>
      </li>
    </ul>
  );
};
