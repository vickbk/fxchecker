import {
  AuthManager,
  SignInInterceptor,
  SignInProvider,
} from "@/features/account";
import { ConverterCard } from "@/features/converter";
import {
  getAllFavorites,
  getFavoritesCount,
  MainToggleFavorite,
} from "@/features/favorites";
import { MainHeader } from "@/features/header";
import { ConversionLogger, getLogsCount } from "@/features/logs";
import { fetchCurrencies } from "@/infra/api/frankfurter";
import { CurrencyProvider } from "@/shared/currencies";
import { HeadingCtx, Main } from "@/shared/heading";
import { ThemeSwitch } from "@/shared/theme";
import { LoadingPlaceholder, Navbar } from "@/shared/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";

export default function Layout({
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
          <HeadingCtx value={0}>
            <Main pageHasH1={false}>
              <MainHeader>
                <ThemeSwitch />
                <AuthManager />
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
                      <MainToggleFavorite
                        SignInInterceptor={SignInInterceptor}
                      />
                    }
                    conversionLogger={
                      <ConversionLogger SignInInterceptor={SignInInterceptor} />
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
            </Main>
          </HeadingCtx>
        </CurrencyProvider>
      </SignInProvider>
      <SpeedInsights />
    </>
  );
}
