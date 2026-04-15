import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura ATS - Intelligent Workspace",
  description:
    "AI-powered recruitment ATS for bulk resume analysis, candidate scoring, and intelligent talent matching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background min-h-screen flex overflow-hidden">
        {children}
      </body>
    </html>
  );
}
