import { loginWithGoogle } from "@/infra/core";
import { BiIcon, SROnly } from "@/shared/utils";
import { SignInDialog } from "../modules/interceptor";

export const SignIn = async () => {
  return (
    <form action={loginWithGoogle} className="relative">
      <SignInDialog />

      <button
        type="button"
        commandfor="sign-in-dialog"
        command="show-modal"
        className="inline-flex items-center cursor-pointer gap-2 bg-lime-500 text-background hover:bg-transparent hover:outline hover:text-lime-500 focus-visible:bg-transparent focus-visible:outline focus-visible:text-lime-500 px-4 py-2 rounded-md shadow-lg transition-transform active:scale-95"
      >
        Sign In <SROnly>to your account</SROnly>
        <BiIcon name="door-open" />
      </button>
    </form>
  );
};
