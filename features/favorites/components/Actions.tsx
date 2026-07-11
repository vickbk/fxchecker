import { BiIcon, SROnly } from "@/shared/utils";

export const Actions = () => {
  return (
    <>
      <dl className="ml-auto">
        <dt className="sr-only">Total Count</dt>
        <dd className="uppercase">8 Favorites</dd>
      </dl>
      <button type="button" className="p-2 bg-card rounded-lg">
        <SROnly>Clear all favorites</SROnly>
        <BiIcon name="trash" />
      </button>
    </>
  );
};
