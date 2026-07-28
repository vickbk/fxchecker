import { BiIcon, SROnly } from "@/shared/utils";

export const ClearButton = ({ handleClear }: { handleClear: () => void }) => {
  return (
    <div className="sticky top-16 flex px-4">
      <button
        type="button"
        className="action-btn ml-auto bg-lime-500 text-red-500 px-2 aspect-square rounded-full"
        onClick={handleClear}
      >
        <SROnly>Clear chat history</SROnly>
        <BiIcon name="trash" />
      </button>
    </div>
  );
};
