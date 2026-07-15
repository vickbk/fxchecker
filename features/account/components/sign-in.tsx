import { loginWithGoogle } from "@/infra/core";
import { Header, Heading } from "@/shared/heading";
import { BiIcon, SROnly } from "@/shared/utils";

export const SignIn = async () => {
  return (
    <form action={loginWithGoogle} className="relative">
      <dialog
        closedby="any"
        id="sign-in-dialog"
        popover=""
        className="m-auto p-6 max-w-md bg-background-secondary/95 border border-card shadow-2xl backdrop:backdrop-blur-sm rounded-lg text-center normal-case"
      >
        <Header className="space-y-1">
          <Heading className="text-2xl font-semibold text-foreground tracking-tight">
            Welcome to Foreign exchange tracker
          </Heading>
          <p className="text-sm text-foreground-secondary mt-4">
            Keep your favorites changes and logs synced accros your devices.
          </p>
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

      <button
        type="button"
        popoverTarget="sign-in-dialog"
        className="inline-flex items-center cursor-pointer gap-2 bg-lime-500 text-background hover:bg-transparent hover:outline hover:text-lime-500 px-4 py-2 rounded-md shadow-lg transition-transform active:scale-95"
      >
        Sign In <SROnly>to your account</SROnly>
        <BiIcon name="door-open" />
      </button>
    </form>
  );
};
