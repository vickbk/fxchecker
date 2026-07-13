import { Menue } from "../Menue";
import { GraphSkeleton } from "./GraphSkeleton";
import { SummarySkeleton } from "./SummarySkeleton";

export const MainHistorySkeleton = () => {
  return (
    <div className="p-4 flex flex-col sm:flex-row flex-wrap gap-4 justify-between items-center">
      <SummarySkeleton />
      <Menue period="" from="" to="" />
      <GraphSkeleton />
    </div>
  );
};
