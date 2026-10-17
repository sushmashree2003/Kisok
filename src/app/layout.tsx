import type { Metadata } from "next";
import "./globals.css";
import "./dashboards.css";

export const metadata: Metadata = {
  title: "Campus Smart Portal",
  description: "Smart Kiosk & Academic Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
