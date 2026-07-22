"use client";

import { BiIcon, SignInInterceptor, SROnly } from "@/shared/utils";
import { useFormStatus } from "react-dom";

export const FavoriteToggleSubmit = ({
  SignInInterceptor,
  isFavorite,
}: {
  SignInInterceptor: SignInInterceptor;
  isFavorite: boolean;
}) => {
  const { pending } = useFormStatus();
  return (
    <SignInInterceptor
      type="submit"
      disabled={pending}
      description="Login to use the add pair currency to favorite feature and many more options"
    >
      {!pending ? (
        <>
          <SROnly> {isFavorite ? "Remove from" : "Add to"} favorite</SROnly>
          <BiIcon name={`star${isFavorite ? "-fill" : ""}`} />
        </>
      ) : (
        <>
          <SROnly>
            {" "}
            {isFavorite ? "Removing from" : "Adding to"} favorite
          </SROnly>
          <BiIcon name={`arrow-repeat inline-block animate-spin`} />
        </>
      )}
    </SignInInterceptor>
  );
};
