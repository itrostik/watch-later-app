import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import React from "react";
import "../scss/global.scss";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Watch Later",
  description: "This is homework for Agona",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
