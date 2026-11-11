import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CARI PROMPT — AI Prompt Reverse Engineering & Generation Studio",
  description: "Ekstrak prompt gambar dan video secara presisi. Siap pakai untuk Google Flow (Veo & Imagen 3), Midjourney, Kling, Sora, Runway, dan chatbot AI.",
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
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased bg-[#0a0a0c] text-zinc-100 min-h-screen flex flex-col selection:bg-[#d4f933] selection:text-black`}
      >
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
