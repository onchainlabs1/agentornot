import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Decision Wizard",
  description: "Enterprise wizard to evaluate AI automation fit."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
