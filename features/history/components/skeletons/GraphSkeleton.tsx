import { LoadingPlaceholder } from "@/shared/utils";

export const GraphSkeleton = () => {
  return (
    <LoadingPlaceholder
      text="loading graph data"
      className="h-64 bg-background-secondary w-full rounded-lg"
    />
  );
};
