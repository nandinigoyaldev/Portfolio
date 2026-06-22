import type { Metadata } from "next";
import "./globals.css";
import SmoothScrolling from "../components/SmoothScrolling";
import ThemeSwitcher from "../components/portfolio/ThemeSwitcher";
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
    <html lang="en" className="h-full antialiased snap-y snap-proximity">
      <body className="min-h-full flex flex-col">
        <ThemeSwitcher />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}

