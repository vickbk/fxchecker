"use client";
import { Header, Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";
import { useAuth } from "../hooks/useAuth";

export const SignInDialog = () => {
  const {
    title = "Welcome to Foreign exchange tracker",
    description = "Keep your favorites changes and logs synced accros your devices.",
    setDescriptions,
  } = useAuth();
  return (
    <dialog
      closedby="any"
      id="sign-in-dialog"
      popover=""
      className="m-auto p-6 max-w-md bg-background-secondary/95 border border-card shadow-2xl backdrop:backdrop-blur-sm rounded-lg text-center normal-case"
      onToggle={(e) => {
        if (e.newState === "closed")
          setDescriptions({ title: undefined, description: undefined });
      }}
    >
      <Header className="space-y-1">
        <Heading className="text-2xl font-semibold text-foreground tracking-tight">
          {title}
        </Heading>
        <p className="text-sm text-foreground-secondary mt-4">{description}</p>
      </Header>

      <button
        type="submit"
        className="my-4 w-full cursor-pointer inline-flex items-center justify-center gap-3 px-4 py-3 rounded-md shadow-sm transition-transform transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 bg-linear-to-br from-red-500 to-green-500 text-slate-900 font-medium"
      >
        <BiIcon name="google" />
        Sign in with Google
      </button>

      <p className="text-xs  text-foreground-secondary pt-4 border-t border-card text-center">
        By continuing you agree to our terms and privacy policy.
      </p>
    </dialog>
  );
};
