import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

const TITLE = "JSON Lens";
const DESCRIPTION =
  "JSON Lens is a tool for visualizing JSON in graphs, analyzing it, editing it, formatting it and validating it";
// const OG_IMAGE_URL =""

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://jsonlens.vercel.app",
    siteName: "JSON LENS",
    // images: [
    //   {
    //     url: OG_IMAGE_URL,
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    // images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${inter.className}`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
