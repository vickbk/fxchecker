import { LoadingPlacehoder } from "@/shared/utils";

export const SummarySkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:flex grow w-full sm:w-auto">
      {Array(4)
        .fill(null)
        .map((_, key) => (
          <LoadingPlacehoder
            className="bg-background-secondary py-16 grow rounded-lg"
            key={key}
          />
        ))}
    </div>
  );
};
