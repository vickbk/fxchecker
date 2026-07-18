import { Heading } from "@/shared/heading";
import { LoadingPlaceholder, SectionsWrapper, SROnly } from "@/shared/utils";

export const MainFavoriteSkeleton = () => {
  return (
    <SectionsWrapper sectionId="favorite-heading">
      <Heading id="favorite-heading" className="uppercase">
        Pin Paired <SROnly>currencies loading...</SROnly>
      </Heading>
      <LoadingPlaceholder className="p-4 px-24 bg-card" />
      <ul className="w-full grid gap-4">
        {Array(4)
          .fill(null)
          .map((_, key) => (
            <li key={key}>
              <LoadingPlaceholder className="p-8 bg-card rounded-lg" />
            </li>
          ))}
      </ul>
    </SectionsWrapper>
  );
};
