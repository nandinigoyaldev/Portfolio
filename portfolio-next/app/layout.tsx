import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nandini | Portfolio & Mentorship",
  description:
    "Portfolio of Nandini - Contact me for collaboration, mentorship, and project opportunities.",
  metadataBase: new URL("http://localhost:3000"),
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

