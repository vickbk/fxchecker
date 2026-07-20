import { SignInInterceptor } from "@/shared/utils";
import { saveConversion } from "../actions";
import { ConversionContent } from "../modules/conversion";

export const ConversionLogger = (params: {
  SignInInterceptor: SignInInterceptor;
}) => {
  return (
    <form action={saveConversion}>
      <ConversionContent {...params} />
    </form>
  );
};
