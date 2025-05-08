import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper"; // Adjust the import path as necessary

export const metadata: Metadata = {
  title: "Mello-Motion",
  description: "Music Curation for your soul..!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" >
      <body>
        <SessionWrapper>{children}</SessionWrapper> {/* Wrap children with SessionProvider using the new component */}
      </body>
    </html>
  );
}
