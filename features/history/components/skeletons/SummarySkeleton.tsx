import { LoadingPlaceholder } from "@/shared/utils";
import { Menue } from "../Menue";

export const SummarySkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:flex grow w-full sm:w-auto">
        {Array(4)
          .fill(null)
          .map((_, key) => (
            <LoadingPlaceholder
              className="bg-background-secondary py-12 grow rounded-lg"
              key={key}
            />
          ))}
      </div>
      <Menue period="" from="" to="" />
    </>
  );
};
