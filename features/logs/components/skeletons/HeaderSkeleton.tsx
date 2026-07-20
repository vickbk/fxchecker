import { Heading } from "@/shared/heading";
import { LoadingPlaceholder, SROnly } from "@/shared/utils";

export const HeaderSkeleton = () => {
  return (
    <>
      <Heading id="logs-loader">
        Conversion log <SROnly>loading...</SROnly>
      </Heading>
      <LoadingPlaceholder className="p-4 ml-auto px-32 bg-card" />
      <LoadingPlaceholder className="p-4 px-32 bg-card" />
      <LoadingPlaceholder className="p-4 bg-card ml-auto" />
    </>
  );
};
