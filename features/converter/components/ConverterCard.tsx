import { FavoriteSuite } from "@/shared/currencies";
import { Article, Heading } from "@/shared/heading";
import { SignInInterceptor } from "@/shared/utils";
import { LogCoversionAction } from "../types";
import { ConverterActions } from "./ConvertActions";
import { FavoriteProvider } from "./FavoriteProvider";
import { LogsContent } from "./LogsContent";
import { LogsProvider } from "./LogsProvider";
import { RateCard } from "./RateCard";
import { Swapper } from "./Swapper";

export const ConverterCard = ({
  SignInInterceptor,
  favoriteSuite,
  logConversion,
}: {
  SignInInterceptor: SignInInterceptor;
  favoriteSuite: FavoriteSuite;
  logConversion: LogCoversionAction;
}) => {
  return (
    <Article className="p-4">
      <Heading className="uppercase text-xl">Check the rate</Heading>
      <div className="flex flex-col gap-4 bg-background-secondary rounded-2xl mt-4">
        <div className="p-4 flex flex-col sm:grid grid-cols-[1fr_auto_1fr] gap-4 pb-0">
          <RateCard isSend />
          <Swapper />
          <RateCard />
        </div>
        <ConverterActions>
          <ul className="uppercase flex justify-center items-center flex-wrap gap-4 sm:ml-auto">
            <li>
              <FavoriteProvider {...{ ...favoriteSuite, SignInInterceptor }} />
            </li>
            <li>
              <LogsProvider logConversion={logConversion}>
                <LogsContent SignInInterceptor={SignInInterceptor} />
              </LogsProvider>
            </li>
          </ul>
        </ConverterActions>
      </div>
    </Article>
  );
};
