import type { Metadata } from "next";
import { CinematicPortfolio } from "@/components/cinematic-portfolio";

export const metadata: Metadata = {
  title: "Quit Stack Labs — José Queiroz",
  description:
    "Independent product practice by José Queiroz. Thoughtful software, mobile products, systems and digital experiences.",
};

export default function Home() {
  return <CinematicPortfolio />;
}
