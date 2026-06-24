import type { Metadata, Viewport } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: "TennisRecap",
  description: "Junior Tennis Planning Platform",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body
        className={`min-h-screen bg-tennis-gray ${sarabun.variable}`}
      >
        <div className="mx-auto max-w-md bg-tennis-white min-h-screen shadow-lg relative">
          {children}
        </div>
      </body>
    </html>
  );
}
