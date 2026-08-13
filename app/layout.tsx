import "./globals.css";
import type { Metadata } from "next";
import RegisterSW from "./register-sw";

export const metadata: Metadata = {
  title: "StudyGenius AI",
  description: "Turn notes into flashcards, effective summaries and simple explanations.",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><RegisterSW />{children}</body></html>;
}
