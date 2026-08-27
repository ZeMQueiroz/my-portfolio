import type { Metadata } from "next";
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
  metadataBase: new URL("https://quiet-stack-labs.vercel.app"),
  title: "Quiet Stack Labs — José Queiroz",
  description:
    "Useful software for quieter, more intentional lives. Independent product practice by José Queiroz.",
  openGraph: {
    title: "Quiet Stack Labs",
    description: "Independent product practice by José Queiroz.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  icons: { icon: "/qsl-icon.png", shortcut: "/qsl-icon.png", apple: "/qsl-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${jetBrainsMono.variable}`}>{children}</body>
    </html>
  );
}
