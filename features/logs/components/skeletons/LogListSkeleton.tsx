import { LoadingPlaceholder } from "@/shared/utils";

export const LogListSkeleton = () => {
  return (
    <div className="grid gap-4 w-full">
      {Array(4)
        .fill(null)
        .map((_, key) => (
          <LoadingPlaceholder
            key={key}
            className="w-full bg-card py-8 rounded-lg"
          />
        ))}
    </div>
  );
};
