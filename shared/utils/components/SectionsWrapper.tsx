import { ReactNode } from "react";

export const SectionsWrapper = ({
  children,
  sectionId,
}: {
  children: ReactNode;
  sectionId: string;
}) => {
  return (
    <section aria-describedby={sectionId} className="p-4">
      <div className="flex flex-wrap rounded-lg p-4 gap-4 bg-background-secondary items-center justify-between">
        {children}
      </div>
    </section>
  );
};
