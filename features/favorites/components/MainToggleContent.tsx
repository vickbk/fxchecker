"use client";
import { useURLState } from "@/shared/url/hooks";
import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { useFormStatus } from "react-dom";

export const MainToggleContent = ({
  favorites,
  SignInInterceptor,
}: { favorites: string[] } & { SignInInterceptor: SignInInterceptor }) => {
  const { from, to } = useURLState();
  const { pending } = useFormStatus();

  const isFavorite = favorites.includes(from + "-" + to);

  return (
    <>
      <input type="hidden" name="base" value={from} />
      <input type="hidden" name="quote" value={to} />
      <SignInInterceptor
        className="uppercase flex w-full gap-2 p-4 bg-lime-500 hover:bg-lime-500/90 border-2 action-btn border-background-secondary rounded-lg text-background"
        type="submit"
        disabled={pending}
        description="Login to save this currency pair to your personalized favorites list."
      >
        <BiIcon name={`star${isFavorite ? "-fill" : ""}`} />{" "}
        {!pending ? (
          <>
            <SROnly>{!isFavorite ? "Add to" : "Remove from"} </SROnly>Favorite
          </>
        ) : (
          <>
            {isFavorite ? "Removing" : "Adding"}...{" "}
            <BiIcon name="arrow animate-spin inline-block" />
          </>
        )}
      </SignInInterceptor>
    </>
  );
};
