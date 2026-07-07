import { loginWithGoogle } from "@/infra/core";
import { Header, Heading } from "@/shared/heading";
import { BiIcon } from "@/shared/utils";

export const SignIn = async () => {
  return (
    <form action={loginWithGoogle} className="relative">
      <dialog
        closedby="any"
        id="sign-in-dialog"
        popover=""
        className="m-auto p-6 max-w-md bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl rounded-lg"
      >
        <Header className="space-y-1">
          <Heading className="text-2xl font-semibold text-white tracking-tight">
            Welcome to Your Movie Guide
          </Heading>
          <p className="text-sm text-slate-400">
            Keep your bookmarks logs and chat synced accros your devices.
          </p>
        </Header>

        <button
          type="submit"
          className="my-4 w-full cursor-pointer inline-flex items-center justify-center gap-3 px-4 py-3 rounded-md shadow-sm transition-transform transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 bg-linear-to-br from-violet-600 to-sky-500 text-slate-900 font-medium"
        >
          <BiIcon name="google" />
          Sign in with Google
        </button>

        <p className="text-xs text-slate-500 pt-4 border-t border-slate-800 text-center">
          By continuing you agree to our terms and privacy policy.
        </p>
      </dialog>

      <button
        type="button"
        popoverTarget="sign-in-dialog"
        className="inline-flex items-center cursor-pointer gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-lg transition-transform active:scale-95"
      >
        Sign In <BiIcon name="door-open" />
      </button>
    </form>
  );
};
