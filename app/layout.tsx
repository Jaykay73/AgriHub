import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgriHub — Direct Farm-to-Table Marketplace",
  description: "Connecting farmers with buyers and financial services through transparency and data-driven credit scoring.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
