import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { BASE_METADATA } from "@/config/seo";
import {
  StructuredData,
  generateLocalBusinessSchema,
  generateOrganizationSchema
} from "@/config/structured-data";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData data={generateLocalBusinessSchema()} />
        <StructuredData data={generateOrganizationSchema()} />
      </head>
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
