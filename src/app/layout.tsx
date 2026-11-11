import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuatPrompt — Studio Orkestrasi & Rekayasa Prompt AI untuk Google Flow",
  description: "Rancang, fabrikasi, dan orkestrasi instruksi prompt AI sinematik tingkat sutradara. Dioptimalkan khusus untuk Google Flow (Google Veo & Imagen 3), Midjourney v6.1, Kling AI, dan video komersial.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-[#07080c] text-slate-100 min-h-screen flex flex-col selection:bg-indigo-500 selection:text-white`}
      >
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
