import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const siteDescription =
  "Chevo Collective is a UCT student engineering community for AI agents, robotics, drones, workshops, and hands-on build projects ahead of the curriculum.";

export const metadata: Metadata = {
  title: {
    default: "Chevo Collective | UCT student engineering workshops and build projects",
    template: "%s | Chevo Collective",
  },
  description: siteDescription,
  applicationName: "Chevo Collective",
  keywords: [
    "Chevo Collective",
    "UCT engineering community",
    "student engineering workshops",
    "AI agent workshops",
    "robotics projects",
    "drone projects",
    "Cape Town student tech community",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Chevo Collective",
    title: "Chevo Collective | UCT student engineering workshops and build projects",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Chevo Collective",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-chevo-bg text-chevo-dark antialiased">
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
