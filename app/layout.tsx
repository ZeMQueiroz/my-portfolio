import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["200", "300", "400", "600"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.quietstacklabs.com"),
  title: {
    default: "Quiet Stack Labs — José Queiroz",
    template: "%s — Quiet Stack Labs",
  },
  description:
    "Independent product design and engineering by José Queiroz. Thoughtful web, mobile, and native software built from strategy through launch.",
  applicationName: "Quiet Stack Labs",
  authors: [{ name: "José Queiroz", url: "https://www.quietstacklabs.com" }],
  creator: "José Queiroz",
  publisher: "Quiet Stack Labs",
  category: "technology",
  keywords: ["José Queiroz", "Quiet Stack Labs", "product design", "software engineering", "web design", "mobile apps", "independent studio"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Quiet Stack Labs — Product design & engineering by José Queiroz",
    description: "Thoughtful web, mobile, and native software built from strategy through launch.",
    url: "/",
    siteName: "Quiet Stack Labs",
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og-v2.png", width: 1200, height: 630, alt: "Quiet Stack Labs — product design and engineering by José Queiroz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiet Stack Labs — José Queiroz",
    description: "Thoughtful web, mobile, and native software built from strategy through launch.",
    images: ["/og-v2.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/qsl-icon.png", shortcut: "/qsl-icon.png", apple: "/qsl-icon.png" },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#030405",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${jetBrainsMono.variable}`}>{children}</body>
    </html>
  );
}
