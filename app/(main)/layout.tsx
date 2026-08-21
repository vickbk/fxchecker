import {
  AuthManager,
  SignInInterceptor,
  SignInProvider,
} from "@/features/account";
import { ChatPopOver } from "@/features/chatbot";
import { ConverterCard } from "@/features/converter";
import {
  getAllFavorites,
  getFavoritesCount,
  MainToggleFavorite,
} from "@/features/favorites";
import { MainHeader } from "@/features/header";
import { ConversionLogger, getLogsCount } from "@/features/logs";
import { Navbar } from "@/features/navbar";
import { fetchCurrencies } from "@/infra/api/frankfurter";
import { CurrencyProvider } from "@/shared/currencies";
import { ThemeSwitch } from "@/shared/theme";
import { LoadingPlaceholder } from "@/shared/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import { Main } from "react-heading-manager";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SignInProvider>
        <CurrencyProvider
          currencies={fetchCurrencies()}
          favorites={getAllFavorites()}
        >
          <Main>
            <MainHeader>
              <ThemeSwitch />
              <Suspense>
                <AuthManager />
              </Suspense>
            </MainHeader>
            <div className="max-w-5xl mx-auto sm:py-8">
              <Suspense
                fallback={
                  <LoadingPlaceholder
                    className="bg-background-secondary py-40 rounded-lg"
                    text="Loading Converter"
                  />
                }
              >
                <ConverterCard
                  favoriteToggle={
                    <MainToggleFavorite {...{ SignInInterceptor }} />
                  }
                  conversionLogger={
                    <ConversionLogger {...{ SignInInterceptor }} />
                  }
                />
              </Suspense>
              <Navbar
                history={{}}
                compare={{}}
                favorites={{ badge: getFavoritesCount() }}
                logs={{ badge: getLogsCount() }}
              />
              {children}
            </div>
            <ChatPopOver />
          </Main>
        </CurrencyProvider>
      </SignInProvider>
      <SpeedInsights />
    </>
  );
}
