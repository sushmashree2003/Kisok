import type { Metadata } from "next";
import "./globals.css";
import "./dashboards.css";

export const metadata: Metadata = {
  title: "Green Valley Public School Portal",
  description: "A place to learn, a space to grow, a community to belong",
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
