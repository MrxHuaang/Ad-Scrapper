import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

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
    default: "Zephr — Airworthiness Directives",
    template: "%s — Zephr",
  },
  description:
    "Search Airworthiness Directives from FAA, EASA, Transport Canada, and ANAC in one place.",
  metadataBase: new URL("https://zephr.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--text-1)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
