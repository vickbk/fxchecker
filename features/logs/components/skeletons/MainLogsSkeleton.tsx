import { SectionsWrapper } from "@/shared/utils";
import { HeaderSkeleton } from "./HeaderSkeleton";
import { LogListSkeleton } from "./LogListSkeleton";

export const MainLogsSkeleton = () => {
  return (
    <SectionsWrapper sectionId="logs-loader">
      <HeaderSkeleton />
      <LogListSkeleton />
    </SectionsWrapper>
  );
};
