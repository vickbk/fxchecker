import { LoadingPlaceholder } from "@/shared/utils";

export const CompareListSkeleton = () => {
  return (
    <>
      <p className="sr-only">Loading compare currency rates.</p>
      <ul className="grid gap-4 p-4">
        {Array(8)
          .fill(null)
          .map((_, key) => (
            <li key={key}>
              <LoadingPlaceholder className="p-4 py-8 bg-card rounded-lg" />
            </li>
          ))}
      </ul>
    </>
  );
};
