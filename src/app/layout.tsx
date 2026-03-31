import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { BASE_METADATA } from "@/config/seo";
import {
  StructuredData,
  generateLocalBusinessSchema,
  generateOrganizationSchema
} from "@/config/structured-data";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  ...BASE_METADATA,
  icons: {
    icon: "/JerryBearLogo.png",
    apple: "/JerryBearLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={generateLocalBusinessSchema()} />
        <StructuredData data={generateOrganizationSchema()} />
      </head>
      <body
        className={`${oswald.variable} ${inter.variable} font-body antialiased bg-surface text-on-surface`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
