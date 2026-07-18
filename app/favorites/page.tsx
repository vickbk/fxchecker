import { MainFavorite, MainFavoriteSkeleton } from "@/features/favorites";
import { getRandomInt } from "@/shared/random";
import { Suspense } from "react";

export default async function Favorite() {
  return (
    <Suspense key={getRandomInt()} fallback={<MainFavoriteSkeleton />}>
      <MainFavorite />
    </Suspense>
  );
}
