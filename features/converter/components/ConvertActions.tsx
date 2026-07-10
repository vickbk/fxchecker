import { BiIcon, SROnly } from "@/shared/utils";

export const ConverterActions = () => {
  return (
    <div className="flex flex-col gap-4 p-4 border-t border-dashed text-center uppercase">
      <dl>
        <dt className="sr-only">Current rate for USD to EUR</dt>
        <dd>1USD = 0.85EUR</dd>
      </dl>
      <ul className="uppercase flex justify-center items-center gap-4">
        <li>
          <button
            type="button"
            className="uppercase flex w-full gap-2 p-4 bg-lime-500 rounded-lg text-background"
          >
            <BiIcon name="star-fill" />
            <SROnly>Add to </SROnly>favorite
          </button>
        </li>
        <li>
          <button
            type="button"
            className="uppercase flex items-center gap-2 p-4 outline-lime-500 rounded-lg outline truncate max-w-full grow"
          >
            <BiIcon name="clock" />
            Log conversion
          </button>
        </li>
      </ul>
    </div>
  );
};
