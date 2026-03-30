import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yuvanraj — Full Stack + ML Engineer",
  description: "I write code that ships and solve problems that stuck.",
  keywords: ["Full Stack Developer", "ML Engineer", "React", "Next.js", "PyTorch"],
  authors: [{ name: "Yuvanraj K S" }],
  openGraph: {
    title: "Yuvanraj — Full Stack + ML Engineer",
    description: "I write code that ships and solve problems that stuck.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
