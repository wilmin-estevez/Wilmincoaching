import type { Metadata } from "next";
import { Open_Sans, Oswald } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WE System — Wilmin Estévez Coaching",
  description: "Panel de coaching deportivo y nutricional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${openSans.variable} ${oswald.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
