import { BiIcon, SROnly } from "@/shared/utils";

export const Swapper = () => {
  return (
    <button
      className="bg-card self-center p-4 rounded-lg font-medium"
      type="button"
    >
      <SROnly>Swap send and receive currencies</SROnly>
      <BiIcon name="arrow-down-up" />
    </button>
  );
};
