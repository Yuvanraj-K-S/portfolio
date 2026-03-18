import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yuvanraj K S — Full Stack + ML Engineer",
  description: "I write code that ships and solve problems that stuck.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}