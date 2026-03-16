import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yuvanraj — Full Stack + ML Engineer",
  description: "I write code that ships and solve problems that stuck.",
  keywords: ["Full Stack Developer", "ML Engineer", "React", "Next.js", "PyTorch"],
  authors: [{ name: "Yuvanraj" }],
  openGraph: {
    title: "Yuvanraj — Full Stack + ML Engineer",
    description: "I write code that ships and solve problems that stuck.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}