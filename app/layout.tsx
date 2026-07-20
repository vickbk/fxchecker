import {
  AuthManager,
  SignInInterceptor,
  SignInProvider,
} from "@/features/account";
import { ConverterCard } from "@/features/converter";
import { MainToggleFavorite } from "@/features/favorites";
import { MainHeader } from "@/features/header";
import { ConversionLogger } from "@/features/logs";
import { fetchCurrencies } from "@/infra/api/frankfurter";
import { config } from "@/shared/config";
import { CurrencyProvider } from "@/shared/currencies";
import { HeadingCtx, Main } from "@/shared/heading";
import { ThemeSwitch } from "@/shared/theme";
import { LoadingPlaceholder, Navbar } from "@/shared/utils";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const jetBrains = JetBrains_Mono({
  variable: "--font-jet-brains-mono",
  subsets: ["latin"],
  weight: ["600", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(config.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default:
      "FX Checker | Multi-Currency Hub & Interactive Financial Analytics",
    template: "%s | FX Checker",
  },
  description:
    "Your all-in-one foreign exchange command center. Use our core real-time Converter to swap currencies instantly, analyze historical charts, compare multiple currency pairs side-by-side, pin favorite watchlists, and trace your calculations through automated activity logs.",
  keywords: [
    "currency converter",
    "historical forex rates",
    "currency comparison",
    "favorite currency tracker",
    "forex transaction logs",
    "live market exchange rates",
  ],
  authors: [{ name: "Vick Bake" }],
  creator: "Frontend Mentor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetBrains.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SignInProvider>
          <CurrencyProvider currencies={fetchCurrencies()}>
            <HeadingCtx value={0}>
              <Main pageHasH1={false}>
                <MainHeader>
                  <ThemeSwitch />
                  <AuthManager />
                </MainHeader>
                <div className="max-w-4xl mx-auto sm:py-8">
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
                        <ConversionLogger
                          SignInInterceptor={SignInInterceptor}
                        />
                      }
                    />
                  </Suspense>
                  <Navbar history={{}} compare={{}} favorites={{}} logs={{}} />
                  {children}
                </div>
              </Main>
            </HeadingCtx>
          </CurrencyProvider>
        </SignInProvider>
      </body>
    </html>
  );
}
