import { auth } from "@/infra/core";
import { Profile } from "./profile";
import { SignIn } from "./sign-in";

export async function AuthManager() {
  const session = await auth();
  if (session?.user) return <Profile session={session} />;
  return <SignIn />;
}
