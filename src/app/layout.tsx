import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { BASE_METADATA } from "@/config/seo";
import {
  StructuredData,
  generateLocalBusinessSchema,
  generateOrganizationSchema
} from "@/config/structured-data";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  ...BASE_METADATA,
  icons: {
    icon: "/bsplogo.png",
    apple: "/bsplogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <StructuredData data={generateLocalBusinessSchema()} />
        <StructuredData data={generateOrganizationSchema()} />
      </head>
      <body
        className={`${orbitron.variable} ${rajdhani.variable} font-body antialiased bg-surface text-on-surface`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
