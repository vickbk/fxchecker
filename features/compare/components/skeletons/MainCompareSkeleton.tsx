import { LoadingPlaceholder } from "@/shared/utils";
import { CompareListSkeleton } from "./CompareListSkeleton";

export const MainCompareSkeleton = () => {
  return (
    <div className="p-4">
      <div className="bg-background-secondary rounded-lg">
        <header className=" p-4 flex justify-between">
          <LoadingPlaceholder
            text="Loading Comparison list"
            className="bg-card px-32 py-4"
          />
          <LoadingPlaceholder className="bg-card px-8 py-4" />
        </header>
        <CompareListSkeleton />
      </div>
    </div>
  );
};
