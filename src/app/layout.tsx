import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Life Games | Interactive Learning Scenarios",
  description: "Educational platform for secondary students to learn life skills through interactive games and scenarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className={`${outfit.variable} font-sans min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
