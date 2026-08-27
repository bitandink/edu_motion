import type {
  Metadata,
} from "next";

import "./globals.css";

export const metadata: Metadata = {
  title:
    "Steady365 Motion Detail Concept",

  description:
    "Motion-driven product detail page concept built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}