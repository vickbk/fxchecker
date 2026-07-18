"use client";
import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { useFormStatus } from "react-dom";
import { useURLState } from "../hooks/useURLState";

export const FavoriteContent = ({
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
      <SignInInterceptor type="submit" disabled={pending}>
        <BiIcon name={`start${isFavorite ? "-fill" : ""}`} />{" "}
        {!pending ? (
          <>
            <SROnly>Add to </SROnly>Favorite
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
