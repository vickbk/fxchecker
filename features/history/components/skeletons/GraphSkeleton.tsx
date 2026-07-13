import { LoadingPlacehoder } from "@/shared/utils";

export const GraphSkeleton = () => {
  return (
    <LoadingPlacehoder
      text="loading graph data"
      className="h-64 bg-background-secondary w-full rounded-lg"
    />
  );
};
