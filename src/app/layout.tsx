import "@/lib/env";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { config } from "../../config";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: config.serverName,
    template: `%s | ${config.serverName}`,
  },
  description: `Strona  ${config.serverName}. Zobacz naszą stronę internetową i dołącz do serwera.`,
  keywords: ["whitelist", "server", "serwer", "fivem", "discord", "minecraft"],
  authors: [{ name: "Alvv" }],
  creator: "Alvv",
  publisher: "Alvv",
  applicationName: config.serverName,
  category: "gaming",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: config.serverName,
    title: config.serverName,
    description:
      "Zaloguj się, wypełnij formularz whitelist i dołącz do serwera.",

    images: ["/favicon-32x32.png"],
  },
  twitter: {
    card: "summary",
    title: config.serverName,
    description:
      "Zaloguj się, wypełnij formularz whitelist i dołącz do serwera.",
    images: ["/favicon-32x32.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
