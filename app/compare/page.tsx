import { SignInInterceptor } from "@/features/account";
import { MainCompare } from "@/features/compare";

export default function Compare() {
  return <MainCompare LoginTrigger={SignInInterceptor} />;
}
