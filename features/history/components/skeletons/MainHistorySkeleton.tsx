import { Menue } from "../Menue";
import { SummarySkeleton } from "./SummarySkeleton";

export const MainHistorySkeleton = () => {
  return (
    <div className="p-4 flex flex-col sm:flex-row flex-wrap gap-4 justify-between">
      <SummarySkeleton />
      <Menue period="" from="" to="" />
    </div>
  );
};
