import { LoadingPlaceholder } from "@/shared/utils";

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

      <LoadingPlaceholder className="px-36 py-6 rounded-lg ml-auto bg-background-secondary" />
    </>
  );
};
