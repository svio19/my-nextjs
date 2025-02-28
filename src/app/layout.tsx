import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define Metadata
export const metadata: Metadata = {
  title: "Mtwitt - AI-Powered responses ",
  description: "Mtwitt is a response motor .",
  keywords: ["AI", "responses", "Automation"],
  authors: [{ name: "silver", url: "https://mtwitt.com" }],
  robots: "index, follow",
  openGraph: {
    title: "Mtwitt - AI-Powered Conversations",
    description: "Unlock the power of AI with Mtwitt, your smart AI assistant for seamless communication.",
    url: "https://www.mtwitt.com",
    siteName: "Mtwitt",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpg", // Change this to your actual OG image
        width: 1200,
        height: 630,
        alt: "Mtwitt AI Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mtwitt - AI-Powered Conversations",
    description: "Enhance your communication with Mtwitt's AI-driven conversation tools.",
    //images: ["https://yourdomain.com/og-image.jpg"], // Change this
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
