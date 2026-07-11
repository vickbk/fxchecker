import { EmptySection } from "@/shared/utils";

export const EmptyHistory = () => {
  return (
    <EmptySection
      heading="No chart data available"
      text="We couldn't load rate history for USD/EUR right now. This usually clear up in a minute"
    />
  );
};
