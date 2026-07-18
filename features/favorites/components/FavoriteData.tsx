import { BiIcon, SROnly } from "@/shared/utils";

export const FavoriteData = async () => {
  return (
    <>
      <dl className="ml-auto">
        <dt>0.8990</dt>
        <dd className="text-red-500 text-xs">
          <BiIcon name="caret-up-fill" /> +16%
        </dd>
      </dl>
      <label className="p-2 rounded-lg border border-lime-500">
        <SROnly>
          Remove from favorite <input type="checkbox" />
        </SROnly>
        <BiIcon name="star-fill text-lime-500" />
      </label>
    </>
  );
};
