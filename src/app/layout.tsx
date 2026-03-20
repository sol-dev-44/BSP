import type { Metadata } from "next";
import { Space_Grotesk, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { BASE_METADATA } from "@/config/seo";
import {
  StructuredData,
  generateLocalBusinessSchema,
  generateOrganizationSchema
} from "@/config/structured-data";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["300", "400", "500", "600", "700"],
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
        className={`${spaceGrotesk.variable} ${beVietnamPro.variable} font-body antialiased bg-surface text-on-surface`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
